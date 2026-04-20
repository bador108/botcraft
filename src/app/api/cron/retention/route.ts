import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const db = createServiceClient()
  const { data: users } = await db
    .from('user_preferences')
    .select('user_id, data_retention_days')
    .gt('data_retention_days', 0)

  let deleted = 0
  for (const u of users ?? []) {
    const cutoff = new Date(Date.now() - u.data_retention_days * 24 * 60 * 60 * 1000).toISOString()
    const { count } = await db
      .from('messages')
      .delete({ count: 'exact' })
      .eq('user_id', u.user_id)
      .lt('created_at', cutoff)
    deleted += count ?? 0
  }

  return NextResponse.json({ success: true, deleted, users: users?.length ?? 0 })
}
