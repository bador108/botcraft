import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const DEFAULTS = {
  timezone: 'Europe/Prague',
  language: 'cs',
  email_notifications: {
    limit_80: true,
    limit_100: true,
    weekly_summary: true,
    failed_payment: true,
    product_updates: false,
  },
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data } = await db
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  return NextResponse.json(data ?? DEFAULTS)
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const db = createServiceClient()

  const { data, error } = await db
    .from('user_preferences')
    .upsert({
      user_id: userId,
      ...body,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
