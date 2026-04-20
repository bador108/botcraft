import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()

  // Zjistíme stripe_customer_id — nejdříve v subscriptions, pak fallback na users
  const { data: sub } = await db
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()

  const { data: user } = await db
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle()

  const customerId = sub?.stripe_customer_id ?? user?.stripe_customer_id

  if (!customerId) {
    return NextResponse.json(
      { error: 'Nemáš aktivní předplatné. Nejdříve si vyber plán.' },
      { status: 400 }
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/billing`,
  })

  return NextResponse.json({ url: session.url })
}
