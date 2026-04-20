import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { subDays } from 'date-fns'

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(req.url)
  const days = parseInt(url.searchParams.get('days') ?? '30')
  const chatbotId = url.searchParams.get('chatbotId')
  const since = subDays(new Date(), days).toISOString()

  const db = createServiceClient()
  const { data: msgs } = await (() => {
    let q = db.from('messages')
      .select('id, chatbot_id, session_id, role, content, model_tier, response_time_ms, rating, is_unanswered, created_at')
      .eq('user_id', userId).gte('created_at', since).order('created_at')
    if (chatbotId) q = q.eq('chatbot_id', chatbotId)
    return q
  })()

  if (!msgs?.length) {
    return new Response('id,session_id,role,content,model_tier,response_time_ms,rating,is_unanswered,created_at\n', {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="messages.csv"' },
    })
  }

  const escape = (v: unknown) => {
    if (v == null) return ''
    const s = String(v).replace(/"/g, '""')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s
  }

  const header = 'id,session_id,role,content,model_tier,response_time_ms,rating,is_unanswered,created_at\n'
  const rows = msgs.map(m =>
    [m.id, m.session_id, m.role, m.content, m.model_tier ?? '', m.response_time_ms ?? '', m.rating ?? '', m.is_unanswered ?? false, m.created_at]
      .map(escape).join(',')
  ).join('\n')

  return new Response(header + rows, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="botcraft-messages-${days}d.csv"`,
    },
  })
}
