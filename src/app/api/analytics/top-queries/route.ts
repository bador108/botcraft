import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { subDays } from 'date-fns'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const type = url.searchParams.get('type') ?? 'top' // 'top' | 'unanswered'
  const chatbotId = url.searchParams.get('chatbotId')
  const since = subDays(new Date(), 30).toISOString()

  const db = createServiceClient()

  if (type === 'unanswered') {
    // Get sessions where assistant marked is_unanswered
    const { data: unansweredSessions } = await (() => {
      let q = db.from('messages').select('session_id')
        .eq('user_id', userId).eq('role', 'assistant').eq('is_unanswered', true).gte('created_at', since)
      if (chatbotId) q = q.eq('chatbot_id', chatbotId)
      return q
    })()

    const sessionIds = Array.from(new Set(unansweredSessions?.map(u => u.session_id) ?? []))
    if (!sessionIds.length) return NextResponse.json([])

    const { data: msgs } = await (() => {
      let q = db.from('messages').select('content').eq('user_id', userId).eq('role', 'user').in('session_id', sessionIds.slice(0, 100))
      if (chatbotId) q = q.eq('chatbot_id', chatbotId)
      return q
    })()

    const counts = new Map<string, number>()
    msgs?.forEach(m => {
      const k = m.content.toLowerCase().trim().slice(0, 200)
      counts.set(k, (counts.get(k) ?? 0) + 1)
    })

    return NextResponse.json(
      Array.from(counts.entries())
        .sort(([, a], [, b]) => b - a)
        .slice(0, 20)
        .map(([query, count]) => ({ query, count }))
    )
  }

  // Top queries (all)
  const { data: msgs } = await (() => {
    let q = db.from('messages').select('content').eq('user_id', userId).eq('role', 'user').gte('created_at', since).limit(2000)
    if (chatbotId) q = q.eq('chatbot_id', chatbotId)
    return q
  })()

  const counts = new Map<string, number>()
  msgs?.forEach(m => {
    const k = m.content.toLowerCase().trim().slice(0, 200)
    counts.set(k, (counts.get(k) ?? 0) + 1)
  })

  return NextResponse.json(
    Array.from(counts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([query, count]) => ({ query, count }))
  )
}
