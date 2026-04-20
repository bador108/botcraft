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
    .from('api_keys')
    .select('id, name, key_prefix, scopes, last_used_at, revoked_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const plan = await getUserPlan(userId)
  const limits = PLAN_LIMITS[plan]
  if (!limits?.api_keys) {
    return NextResponse.json({ error: 'API klíče jsou dostupné pouze na Studio+ plánu' }, { status: 403 })
  }

  const { name, scopes, expiresIn } = await req.json() as {
    name: string
    scopes?: string[]
    expiresIn?: number // days, null = never
  }

  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const randomPart = crypto.randomBytes(24).toString('base64url')
  const fullKey = `sk_bc_live_${randomPart}`
  const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex')
  const keyPrefix = fullKey.slice(0, 16) + '...'

  const db = createServiceClient()
  const { data, error } = await db
    .from('api_keys')
    .insert({
      user_id: userId,
      name: name.trim(),
      key_prefix: keyPrefix,
      key_hash: keyHash,
      scopes: scopes ?? ['read'],
      expires_at: expiresIn ? new Date(Date.now() + expiresIn * 86400000).toISOString() : null,
    })
    .select('id, name, key_prefix, scopes, created_at')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Failed to create key' }, { status: 500 })

  return NextResponse.json({ ...data, fullKey })
}
