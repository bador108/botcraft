import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { authenticateApiKey } from '@/lib/api-auth'

// GET /api/v1/chatbots — list user's chatbots
export async function GET(req: Request) {
  const auth = await authenticateApiKey(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data } = await db
    .from('chatbots')
    .select('id, name, model, is_active, welcome_message, created_at')
    .eq('user_id', auth.userId)
    .order('created_at', { ascending: false })

  return NextResponse.json({ chatbots: data ?? [] })
}
