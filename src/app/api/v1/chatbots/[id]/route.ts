import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { authenticateApiKey } from '@/lib/api-auth'

// GET /api/v1/chatbots/:id
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiKey(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServiceClient()

  const { data } = await db
    .from('chatbots')
    .select('id, name, model, system_prompt, welcome_message, is_active, created_at')
    .eq('id', id)
    .eq('user_id', auth.userId)
    .single()

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

// PATCH /api/v1/chatbots/:id
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiKey(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!auth.scopes.includes('write')) return NextResponse.json({ error: 'Insufficient scope' }, { status: 403 })

  const { id } = await params
  const body = await req.json() as Record<string, unknown>
  const allowed = ['name', 'system_prompt', 'welcome_message', 'is_active', 'model']
  const updates = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)))

  const db = createServiceClient()
  const { data, error } = await db
    .from('chatbots')
    .update(updates)
    .eq('id', id)
    .eq('user_id', auth.userId)
    .select('id, name, model, system_prompt, welcome_message, is_active')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json(data)
}
