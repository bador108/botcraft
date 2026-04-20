import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { clerkClient } from '@clerk/nextjs/server'

export const maxDuration = 60

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient()

  const { data: pending } = await db
    .from('account_deletions')
    .select('user_id')
    .lte('delete_after', new Date().toISOString())

  if (!pending?.length) {
    return NextResponse.json({ deleted: 0 })
  }

  let deleted = 0
  const clerk = await clerkClient()

  for (const { user_id } of pending) {
    try {
      // Delete all user data from DB (cascades handle related records)
      await db.from('chatbots').delete().eq('user_id', user_id)
      await db.from('documents').delete().eq('user_id', user_id)
      await db.from('messages').delete().eq('user_id', user_id)
      await db.from('api_keys').delete().eq('user_id', user_id)
      await db.from('webhooks').delete().eq('user_id', user_id)
      await db.from('user_preferences').delete().eq('user_id', user_id)
      await db.from('subscriptions').delete().eq('user_id', user_id)
      await db.from('users').delete().eq('id', user_id)
      await db.from('account_deletions').delete().eq('user_id', user_id)

      // Delete Clerk account
      await clerk.users.deleteUser(user_id)
      deleted++
    } catch {
      // Log and continue — don't fail the whole cron
      console.error(`Failed to delete user ${user_id}`)
    }
  }

  return NextResponse.json({ deleted })
}
