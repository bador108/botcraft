import { createServiceClient } from './supabase'

function currentMonth(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export async function getCurrentUsage(userId: string): Promise<{
  messageCount: number
  premiumModelCount: number
}> {
  const db = createServiceClient()
  const { data } = await db
    .from('usage')
    .select('message_count, premium_model_count')
    .eq('user_id', userId)
    .eq('month_year', currentMonth())
    .maybeSingle()

  return {
    messageCount: data?.message_count ?? 0,
    premiumModelCount: data?.premium_model_count ?? 0,
  }
}

export async function incrementUsage(userId: string, model: string): Promise<void> {
  const db = createServiceClient()
  const isPremium = model === 'deepseek-r1-distill-llama-70b'

  await db.rpc('increment_usage', {
    p_user_id: userId,
    p_month_year: currentMonth(),
    p_is_premium: isPremium,
  })
}
