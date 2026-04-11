import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data } = await db.from('users').select('plan, message_count_month').eq('id', userId).single()

  return NextResponse.json(data ?? { plan: 'free', message_count_month: 0 })
}
