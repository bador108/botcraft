import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/notifications/send'
import { weeklyHtml } from '@/lib/notifications/templates'
import { subDays, format } from 'date-fns'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const db = createServiceClient()
  const since = subDays(new Date(), 7).toISOString()

  // Načti aktivní uživatele za poslední týden
  const { data: activeUsers } = await db
    .from('messages')
    .select('user_id')
    .gte('created_at', since)
    .eq('role', 'user')

  const userIds = Array.from(new Set(activeUsers?.map(m => m.user_id).filter(Boolean) ?? []))

  let sent = 0
  for (const userId of userIds) {
    try {
      // Stats za poslední týden
      const { data: msgs } = await db
        .from('messages')
        .select('session_id, chatbot_id')
        .eq('user_id', userId)
        .eq('role', 'user')
        .gte('created_at', since)

      if (!msgs?.length) continue

      const totalMessages = msgs.length
      const uniqueSessions = new Set(msgs.map(m => m.session_id)).size

      // Top bot
      const botCounts = new Map<string, number>()
      msgs.forEach(m => botCounts.set(m.chatbot_id, (botCounts.get(m.chatbot_id) ?? 0) + 1))
      const topBotId = Array.from(botCounts.entries()).sort(([, a], [, b]) => b - a)[0]?.[0]

      let topBotName = ''
      if (topBotId) {
        const { data: bot } = await db.from('chatbots').select('name').eq('id', topBotId).maybeSingle()
        topBotName = bot?.name ?? ''
      }

      const period = `${format(subDays(new Date(), 7), 'd.M.')} – ${format(new Date(), 'd.M.yyyy')}`

      await sendEmail({
        userId,
        subject: `Týdenní přehled BotCraft (${period})`,
        html: weeklyHtml({ totalMessages, uniqueSessions, topBot: topBotName, period }),
        notificationType: 'weekly_summary',
      })

      sent++
    } catch {
      // Pokračuj dalším uživatelem
    }
  }

  return NextResponse.json({ success: true, sent, users: userIds.length })
}
