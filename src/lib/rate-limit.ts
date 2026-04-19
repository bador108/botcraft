import { createServiceClient } from './supabase'

export async function checkRateLimit(
  userId: string,
  limit: { requests: number; window_seconds: number }
): Promise<boolean> {
  const db = createServiceClient()
  const windowStart = new Date(Date.now() - limit.window_seconds * 1000).toISOString()

  const { count } = await db
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', windowStart)

  if ((count ?? 0) >= limit.requests) return true

  await db.from('rate_limits').insert({ user_id: userId })
  return false
}
