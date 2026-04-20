import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServiceClient()

  // Verify ownership
  const { data: hook } = await db
    .from('webhooks')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!hook) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data } = await db
    .from('webhook_deliveries')
    .select('id, event_type, status_code, succeeded, duration_ms, created_at')
    .eq('webhook_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json(data ?? [])
}
