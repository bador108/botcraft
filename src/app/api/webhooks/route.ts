import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import type { Plan } from '@/types'

async function getUserPlan(userId: string): Promise<Plan> {
  const db = createServiceClient()
  const { data } = await db.from('users').select('plan').eq('id', userId).single()
  return (data?.plan ?? 'hobby') as Plan
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data } = await db
    .from('webhooks')
    .select('id, name, url, events, enabled, last_triggered_at, last_status_code, consecutive_failures, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plan = await getUserPlan(userId)
  const limits = PLAN_LIMITS[plan]
  if (!limits?.webhooks) {
    return NextResponse.json({ error: 'Webhooky jsou dostupné pouze na Studio+ plánu' }, { status: 403 })
  }

  const { name, url, events } = await req.json() as {
    name: string
    url: string
    events: string[]
  }

  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  if (!url?.startsWith('https://')) return NextResponse.json({ error: 'URL musí začínat https://' }, { status: 400 })
  if (!events?.length) return NextResponse.json({ error: 'Aspoň jedna událost' }, { status: 400 })

  const secret = crypto.randomBytes(32).toString('hex')
  const db = createServiceClient()

  const { data, error } = await db
    .from('webhooks')
    .insert({
      user_id: userId,
      name: name.trim(),
      url,
      events,
      secret,
    })
    .select('id, name, url, events, enabled, created_at')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })

  return NextResponse.json({ ...data, secret })
}
