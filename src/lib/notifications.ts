import { createServiceClient } from './supabase'
import { sendEmail } from './notifications/send'
import { limitReachedHtml } from './notifications/templates'
import type { Plan } from '@/types'
import { PLAN_LIMITS } from './plans'

function currentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export async function notifyOwnerOfLimit(userId: string, plan: Plan): Promise<void> {
  const db = createServiceClient()
  const month = currentMonth()

  // Max 1x za měsíc
  const { data: existing } = await db
    .from('limit_notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('month_year', month)
    .maybeSingle()

  if (existing) return

  const limit = PLAN_LIMITS[plan]?.messages_per_month
  const limitNum = limit === Infinity ? 0 : (limit ?? 50)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://botcraft.app'

  await sendEmail({
    userId,
    subject: 'Tvůj chatbot dosáhl měsíčního limitu zpráv',
    html: limitReachedHtml({
      email: '',
      plan,
      limit: limitNum,
      percent: 100,
      upgradeUrl: `${appUrl}/billing`,
    }),
    notificationType: 'limit_100',
  }).catch(() => {})

  await db.from('limit_notifications').insert({ user_id: userId, month_year: month })
}
