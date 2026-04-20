import crypto from 'crypto'
import { createServiceClient } from '@/lib/supabase'

interface ApiAuthResult {
  userId: string
  scopes: string[]
}

export async function authenticateApiKey(req: Request): Promise<ApiAuthResult | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer sk_bc_')) return null

  const key = authHeader.slice(7)
  const hash = crypto.createHash('sha256').update(key).digest('hex')

  const db = createServiceClient()
  const { data } = await db
    .from('api_keys')
    .select('user_id, scopes, revoked_at, expires_at')
    .eq('key_hash', hash)
    .maybeSingle()

  if (!data) return null
  if (data.revoked_at) return null
  if (data.expires_at && new Date(data.expires_at) < new Date()) return null

  // Update last_used_at (fire and forget)
  db.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('key_hash', hash).then(() => {})

  return { userId: data.user_id, scopes: data.scopes ?? ['read'] }
}
