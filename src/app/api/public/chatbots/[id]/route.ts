import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// Public endpoint — returns only safe, non-sensitive bot config for the widget
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = createServiceClient()
  const { data, error } = await db
    .from('chatbots')
    .select('id, name, avatar, theme_color, welcome_message, is_active')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}
