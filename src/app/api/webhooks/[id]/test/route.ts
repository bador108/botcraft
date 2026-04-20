import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { triggerWebhooks } from '@/lib/webhooks/send'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const db = createServiceClient()

  const { data: hook } = await db
    .from('webhooks')
    .select('id, url, secret, events')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (!hook) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Send test event for first subscribed event type
  const testEvent = hook.events?.[0] ?? 'test'
  await triggerWebhooks(userId, testEvent, {
    test: true,
    webhook_id: id,
    message: 'Toto je testovací webhook z BotCraft',
  })

  return NextResponse.json({ success: true, event: testEvent })
}
