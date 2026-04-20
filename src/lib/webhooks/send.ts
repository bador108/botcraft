import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase'

export interface WebhookPayload {
  event: string
  data: Record<string, unknown>
  timestamp: string
}

async function deliverWebhook(
  webhookId: string,
  url: string,
  secret: string,
  payload: WebhookPayload
): Promise<void> {
  const body = JSON.stringify(payload)
  const sig = crypto.createHmac('sha256', secret).update(body).digest('hex')
  const start = Date.now()

  let statusCode = 0
  let responseBody = ''
  let succeeded = false

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BotCraft-Signature': `sha256=${sig}`,
        'X-BotCraft-Event': payload.event,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    })
    statusCode = res.status
    responseBody = await res.text().catch(() => '')
    succeeded = res.ok
  } catch {
    statusCode = 0
    succeeded = false
  }

  const duration = Date.now() - start
  const db = createServiceClient()

  await db.from('webhook_deliveries').insert({
    webhook_id: webhookId,
    event_type: payload.event,
    payload,
    status_code: statusCode,
    response_body: responseBody.slice(0, 2000),
    duration_ms: duration,
    succeeded,
  })

  await db.from('webhooks')
    .update({
      last_triggered_at: new Date().toISOString(),
      last_status_code: statusCode,
    })
    .eq('id', webhookId)

  if (succeeded) {
    await db.from('webhooks').update({ consecutive_failures: 0 }).eq('id', webhookId)
  } else {
    // Read current + increment
    const { data: hook } = await db.from('webhooks').select('consecutive_failures').eq('id', webhookId).single()
    const failures = (hook?.consecutive_failures ?? 0) + 1
    await db.from('webhooks').update({ consecutive_failures: failures }).eq('id', webhookId)
    // Auto-disable after 10 consecutive failures
    if (failures >= 10) {
      await db.from('webhooks').update({ enabled: false }).eq('id', webhookId)
    }
  }
}

export async function triggerWebhooks(userId: string, event: string, data: Record<string, unknown>): Promise<void> {
  const db = createServiceClient()

  const { data: hooks } = await db
    .from('webhooks')
    .select('id, url, secret')
    .eq('user_id', userId)
    .eq('enabled', true)
    .contains('events', [event])

  if (!hooks?.length) return

  const payload: WebhookPayload = {
    event,
    data,
    timestamp: new Date().toISOString(),
  }

  // Fire all in parallel, ignore errors (fire-and-forget)
  await Promise.allSettled(
    hooks.map(h => deliverWebhook(h.id, h.url, h.secret, payload))
  )
}
