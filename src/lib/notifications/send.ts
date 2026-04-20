import { createServiceClient } from '@/lib/supabase'

function getResend() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Resend } = require('resend')
  return new Resend(process.env.RESEND_API_KEY!)
}

async function getUserEmail(userId: string): Promise<string | null> {
  const { clerkClient } = await import('@clerk/nextjs/server')
  const client = await clerkClient()
  try {
    const user = await client.users.getUser(userId)
    return user.emailAddresses[0]?.emailAddress ?? null
  } catch {
    return null
  }
}

type NotifKey =
  | 'limit_80'
  | 'limit_100'
  | 'weekly_summary'
  | 'failed_payment'
  | 'product_updates'
  | 'account_deletion'

async function isEnabled(userId: string, key: NotifKey): Promise<boolean> {
  const db = createServiceClient()
  const { data } = await db
    .from('user_preferences')
    .select('email_notifications')
    .eq('user_id', userId)
    .maybeSingle()
  return data?.email_notifications?.[key] !== false
}

export async function sendEmail(params: {
  userId: string
  subject: string
  html: string
  notificationType: NotifKey
  /** true = billing/security emaily, ignoruje user preference */
  transactional?: boolean
}) {
  if (!process.env.RESEND_API_KEY) return

  if (!params.transactional) {
    const enabled = await isEnabled(params.userId, params.notificationType)
    if (!enabled) return
  }

  const email = await getUserEmail(params.userId)
  if (!email) return

  const resend = getResend()
  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'BotCraft <noreply@botcraft.app>',
    to: email,
    replyTo: process.env.REPLY_TO_EMAIL,
    subject: params.subject,
    html: params.html,
  })
}
