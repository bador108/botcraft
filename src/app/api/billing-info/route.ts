import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data } = await db
    .from('billing_info')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return NextResponse.json(data ?? {})
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createServiceClient()

  const { data, error } = await db
    .from('billing_info')
    .upsert({
      user_id: userId,
      ...body,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Synchronizujeme adresu do Stripe customer (pokud existuje)
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

  if (customerId && body.address_line1) {
    await stripe.customers.update(customerId, {
      address: {
        line1: body.address_line1,
        line2: body.address_line2 ?? undefined,
        city: body.city ?? undefined,
        postal_code: body.postal_code ?? undefined,
        country: body.country ?? 'CZ',
      },
    }).catch(() => {/* neblokující — Stripe update může selhat tiše */})
  }

  return NextResponse.json(data)
}
