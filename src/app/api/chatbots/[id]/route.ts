import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import type { User } from '@/types'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data, error } = await db
    .from('chatbots')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data: user } = await db.from('users').select('plan').eq('id', userId).single()
  const plan = (user as User | null)?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]

  const body = await req.json()
  const { name, avatar, system_prompt, model, theme_color, welcome_message, allowed_domains, is_active } = body

  if (model && !limits.models.includes(model)) {
    return NextResponse.json({ error: 'Model not available on your plan.' }, { status: 403 })
  }

  const { data, error } = await db
    .from('chatbots')
    .update({
      name: name?.trim(),
      avatar,
      system_prompt,
      model,
      theme_color,
      welcome_message,
      allowed_domains,
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found or update failed' }, { status: 404 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { error } = await db
    .from('chatbots')
    .delete()
    .eq('id', params.id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
