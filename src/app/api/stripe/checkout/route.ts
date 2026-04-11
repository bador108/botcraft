import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()
  const priceId = plan === 'pro'
    ? process.env.STRIPE_PRO_PRICE_ID!
    : process.env.STRIPE_BUSINESS_PRICE_ID!

  if (!priceId) return NextResponse.json({ error: 'Price not configured' }, { status: 500 })

  const db = createServiceClient()
  const { data: user } = await db.from('users').select('stripe_customer_id, email').eq('id', userId).single()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: user?.stripe_customer_id ?? undefined,
    customer_email: user?.stripe_customer_id ? undefined : (user?.email ?? undefined),
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/billing?success=1`,
    cancel_url: `${appUrl}/billing?canceled=1`,
    metadata: { userId },
  })

  return NextResponse.json({ url: session.url })
}
