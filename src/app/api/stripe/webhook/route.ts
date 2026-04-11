import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId
    if (!userId) return NextResponse.json({ received: true })

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const priceId = subscription.items.data[0]?.price.id

    const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro'
      : priceId === process.env.STRIPE_BUSINESS_PRICE_ID ? 'business'
      : 'free'

    await db.from('users').update({
      plan,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
    }).eq('id', userId)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object
    await db.from('users').update({ plan: 'free', stripe_subscription_id: null })
      .eq('stripe_subscription_id', subscription.id)
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object
    const priceId = subscription.items.data[0]?.price.id
    const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro'
      : priceId === process.env.STRIPE_BUSINESS_PRICE_ID ? 'business'
      : 'free'

    await db.from('users').update({ plan })
      .eq('stripe_subscription_id', subscription.id)
  }

  return NextResponse.json({ received: true })
}
