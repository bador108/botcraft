import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { authenticateApiKey } from '@/lib/api-auth'

// GET /api/v1/chatbots/:id/messages
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiKey(req)
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 1000)
  const offset = parseInt(searchParams.get('offset') ?? '0')

  const db = createServiceClient()

  // Verify ownership
  const { data: bot } = await db
    .from('chatbots')
    .select('id')
    .eq('id', id)
    .eq('user_id', auth.userId)
    .single()

  if (!bot) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data, count } = await db
    .from('messages')
    .select('id, session_id, role, content, rating, created_at', { count: 'exact' })
    .eq('chatbot_id', id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({ messages: data ?? [], total: count ?? 0, limit, offset })
}
