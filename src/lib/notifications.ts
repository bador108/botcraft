// TODO: npm install resend — pak odstraň tento komentář
// import { Resend } from 'resend'
import { createServiceClient } from './supabase'
import type { Plan } from '@/types'

// const resend = new Resend(process.env.RESEND_API_KEY!)

function currentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

async function getUserEmail(userId: string): Promise<string | null> {
  const db = createServiceClient()
  const { data } = await db.from('users').select('email').eq('id', userId).single()
  return data?.email ?? null
}

export async function notifyOwnerOfLimit(userId: string, plan: Plan): Promise<void> {
  const db = createServiceClient()
  const month = currentMonth()

  // Pošli maximálně 1x za měsíc
  const { data: existing } = await db
    .from('limit_notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('month_year', month)
    .maybeSingle()

  if (existing) return

  const email = await getUserEmail(userId)
  if (!email) return

  const limit = plan === 'hobby' || plan === 'free' ? '50' : '4 000'

  // TODO: Odkomentuj po instalaci resend
  // await resend.emails.send({
  //   from: 'BotCraft <noreply@botcraft.app>',
  //   to: email,
  //   subject: 'Tvůj chatbot dosáhl měsíčního limitu',
  //   html: `
  //     <p>Ahoj,</p>
  //     <p>Tvůj chatbot právě vyčerpal měsíční limit ${limit} zpráv.</p>
  //     <p>Do konce měsíce bude uživatelům odpovídat zprávou "Vrátím se 1. dne příštího měsíce".</p>
  //     ${plan === 'hobby' || plan === 'free'
  //       ? '<p><a href="https://botcraft.vercel.app/billing">Upgrade na Maker za 490 Kč/měs</a> — 4 000 zpráv měsíčně, bez badge, plné RAG.</p>'
  //       : ''}
  //     <p>BotCraft</p>
  //   `,
  // })

  console.log(`[notify] Limit reached for ${email} (${plan}, ${limit} msgs, ${month})`)

  await db.from('limit_notifications').insert({
    user_id: userId,
    month_year: month,
  })
}
