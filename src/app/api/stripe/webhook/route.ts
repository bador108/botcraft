import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      if (!userId) break

      const subscriptionId = session.subscription as string
      const customerId = session.customer as string

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const item = subscription.items.data[0]

      const priceId = item?.price.id
      const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro'
        : priceId === process.env.STRIPE_BUSINESS_PRICE_ID ? 'business'
        : 'free'

      const cycle = item?.price.recurring?.interval === 'year' ? 'yearly' : 'monthly'

      // Aktualizuj users tabulku (zpětná kompatibilita)
      await db.from('users').update({
        plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      }).eq('id', userId)

      // Upsert do subscriptions tabulky
      await db.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan,
        status: subscription.status,
        billing_cycle: cycle,
        current_period_start: item?.current_period_start
          ? new Date(item.current_period_start * 1000).toISOString()
          : null,
        current_period_end: item?.current_period_end
          ? new Date(item.current_period_end * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const item = subscription.items.data[0]
      const priceId = item?.price.id

      const plan = priceId === process.env.STRIPE_PRO_PRICE_ID ? 'pro'
        : priceId === process.env.STRIPE_BUSINESS_PRICE_ID ? 'business'
        : 'free'

      // Aktualizuj users
      await db.from('users').update({ plan })
        .eq('stripe_subscription_id', subscription.id)

      // Aktualizuj subscriptions
      await db.from('subscriptions').update({
        plan,
        status: subscription.status,
        current_period_start: item?.current_period_start
          ? new Date(item.current_period_start * 1000).toISOString()
          : null,
        current_period_end: item?.current_period_end
          ? new Date(item.current_period_end * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      await db.from('users').update({ plan: 'free', stripe_subscription_id: null })
        .eq('stripe_subscription_id', subscription.id)

      await db.from('subscriptions').update({
        plan: 'hobby',
        status: 'canceled',
        stripe_subscription_id: null,
        updated_at: new Date().toISOString(),
      }).eq('stripe_subscription_id', subscription.id)
      break
    }

    case 'invoice.paid':
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice

      // Najdi user_id přes stripe_customer_id
      const { data: sub } = await db
        .from('subscriptions')
        .select('user_id')
        .eq('stripe_customer_id', invoice.customer as string)
        .maybeSingle()

      const { data: user } = !sub ? await db
        .from('users')
        .select('id')
        .eq('stripe_customer_id', invoice.customer as string)
        .maybeSingle() : { data: null }

      const userId = sub?.user_id ?? user?.id
      if (!userId) break

      await db.from('invoices').upsert({
        user_id: userId,
        stripe_invoice_id: invoice.id,
        amount_cents: invoice.amount_paid,
        currency: invoice.currency.toUpperCase(),
        status: invoice.status ?? 'open',
        invoice_pdf: invoice.invoice_pdf,
        hosted_invoice_url: invoice.hosted_invoice_url,
        period_start: invoice.period_start
          ? new Date(invoice.period_start * 1000).toISOString()
          : null,
        period_end: invoice.period_end
          ? new Date(invoice.period_end * 1000).toISOString()
          : null,
        paid_at: invoice.status_transitions?.paid_at
          ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
          : null,
      }, { onConflict: 'stripe_invoice_id' })
      break
    }
  }

  return NextResponse.json({ received: true })
}
