import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { OWNER_EMAIL } from '@/lib/plans'

// Jednorázový endpoint — nastav ADMIN_SECRET v env a zavolej jednou
export async function POST(req: Request) {
  const secret = req.headers.get('x-admin-secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('users')
    .update({ plan: 'enterprise' })
    .eq('email', OWNER_EMAIL)
    .select('id, email, plan')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ updated: data })
}
