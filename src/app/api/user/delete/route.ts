import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Schedules account for deletion after 30-day grace period
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { confirmation } = await req.json() as { confirmation?: string }
  if (confirmation !== 'smazat můj účet') {
    return NextResponse.json({ error: 'Nesprávné potvrzení' }, { status: 400 })
  }

  const db = createServiceClient()
  const deleteAfter = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await db
    .from('account_deletions')
    .upsert({ user_id: userId, delete_after: deleteAfter })

  if (error) return NextResponse.json({ error: 'Failed to schedule deletion' }, { status: 500 })

  return NextResponse.json({ success: true, deleteAfter })
}

// Cancel scheduled deletion
export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  await db.from('account_deletions').delete().eq('user_id', userId)

  return NextResponse.json({ success: true })
}
