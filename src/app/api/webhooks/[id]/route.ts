import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServiceClient()

  const { data } = await db
    .from('webhooks')
    .select('id, name, url, events, enabled, last_triggered_at, last_status_code, consecutive_failures, created_at')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json() as { name?: string; url?: string; events?: string[]; enabled?: boolean }
  const db = createServiceClient()

  const updates: Record<string, unknown> = {}
  if (body.name !== undefined) updates.name = body.name.trim()
  if (body.url !== undefined) {
    if (!body.url.startsWith('https://')) return NextResponse.json({ error: 'URL musí začínat https://' }, { status: 400 })
    updates.url = body.url
  }
  if (body.events !== undefined) updates.events = body.events
  if (body.enabled !== undefined) updates.enabled = body.enabled

  const { data, error } = await db
    .from('webhooks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select('id, name, url, events, enabled, created_at')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServiceClient()

  await db.from('webhooks').delete().eq('id', id).eq('user_id', userId)
  return NextResponse.json({ success: true })
}
