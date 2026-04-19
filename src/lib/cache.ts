import crypto from 'crypto'
import { createServiceClient } from './supabase'

function hashKey(chatbotId: string, query: string): string {
  return crypto
    .createHash('sha256')
    .update(`${chatbotId}:${query.toLowerCase().trim()}`)
    .digest('hex')
}

export async function getCachedResponse(chatbotId: string, query: string): Promise<string | null> {
  const key = hashKey(chatbotId, query)
  const db = createServiceClient()

  const { data } = await db
    .from('response_cache')
    .select('response')
    .eq('cache_key', key)
    .gte('expires_at', new Date().toISOString())
    .maybeSingle()

  return data?.response ?? null
}

export async function setCachedResponse(chatbotId: string, query: string, response: string): Promise<void> {
  const key = hashKey(chatbotId, query)
  const db = createServiceClient()

  await db.from('response_cache').upsert({
    cache_key: key,
    chatbot_id: chatbotId,
    response,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })
}
