import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { subDays } from 'date-fns'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sum(rows: any[], field: string): number {
  return rows.reduce((s, r) => s + (Number(r[field]) || 0), 0)
}

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const days = parseInt(url.searchParams.get('days') ?? '30')
  const chatbotId = url.searchParams.get('chatbotId')

  const since = subDays(new Date(), days).toISOString().slice(0, 10)
  const prevSince = subDays(new Date(), days * 2).toISOString().slice(0, 10)

  const db = createServiceClient()

  // Fallback na messages direkt (materialized view možná ještě neexistuje)
  // Zkusíme analytics_daily, fallback na messages
  let current: Record<string, unknown>[] = []
  let previous: Record<string, unknown>[] = []

  const { data: viewData, error: viewError } = await (() => {
    let q = db.from('analytics_daily').select('*').eq('user_id', userId).gte('date', since)
    if (chatbotId) q = q.eq('chatbot_id', chatbotId)
    return q
  })()

  if (!viewError && viewData) {
    current = viewData
    const { data: prevData } = await (() => {
      let q = db.from('analytics_daily').select('*').eq('user_id', userId).gte('date', prevSince).lt('date', since)
      if (chatbotId) q = q.eq('chatbot_id', chatbotId)
      return q
    })()
    previous = prevData ?? []
  } else {
    // Fallback: aggregate from messages directly
    const { data: msgs } = await (() => {
      let q = db.from('messages').select('role, session_id, response_time_ms, rating, is_unanswered, model_tier, created_at')
        .eq('user_id', userId).gte('created_at', since + 'T00:00:00Z')
      if (chatbotId) q = q.eq('chatbot_id', chatbotId)
      return q
    })()

    if (msgs) {
      // Group by date manually
      const byDate = new Map<string, typeof msgs>()
      for (const m of msgs) {
        const d = m.created_at.slice(0, 10)
        if (!byDate.has(d)) byDate.set(d, [])
        byDate.get(d)!.push(m)
      }
      current = Array.from(byDate.entries()).map(([date, rows]) => ({
        date,
        user_messages: rows.filter(r => r.role === 'user').length,
        assistant_messages: rows.filter(r => r.role === 'assistant').length,
        unique_sessions: new Set(rows.map(r => r.session_id)).size,
        avg_response_ms: rows.filter(r => r.role === 'assistant' && r.response_time_ms)
          .reduce((s, r) => s + (r.response_time_ms ?? 0), 0) / (rows.filter(r => r.role === 'assistant' && r.response_time_ms).length || 1),
        positive_ratings: rows.filter(r => r.rating === 1).length,
        negative_ratings: rows.filter(r => r.rating === -1).length,
        unanswered_count: rows.filter(r => r.is_unanswered).length,
        fast_count: rows.filter(r => r.model_tier === 'fast').length,
        balanced_count: rows.filter(r => r.model_tier === 'balanced').length,
        premium_count: rows.filter(r => r.model_tier === 'premium').length,
      }))
    }
  }

  const totalMessages = sum(current, 'user_messages')
  const positiveRatings = sum(current, 'positive_ratings')
  const negativeRatings = sum(current, 'negative_ratings')
  const ratedTotal = positiveRatings + negativeRatings

  return NextResponse.json({
    totalMessages,
    uniqueSessions: sum(current, 'unique_sessions'),
    avgResponseMs: current.length
      ? current.reduce((s, r) => s + (Number(r.avg_response_ms) || 0), 0) / current.length
      : 0,
    positiveRatings,
    negativeRatings,
    satisfactionRate: ratedTotal > 0 ? Math.round((positiveRatings / ratedTotal) * 100) : null,
    unansweredCount: sum(current, 'unanswered_count'),
    modelUsage: {
      fast: sum(current, 'fast_count'),
      balanced: sum(current, 'balanced_count'),
      premium: sum(current, 'premium_count'),
    },
    dailyData: current,
    previousPeriod: {
      totalMessages: sum(previous, 'user_messages'),
      uniqueSessions: sum(previous, 'unique_sessions'),
    },
  })
}
