import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import type { Plan } from '@/types'

// Public endpoint — returns only safe, non-sensitive bot config for the widget
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = createServiceClient()
  const { data, error } = await db
    .from('chatbots')
    .select('id, name, avatar, theme_color, welcome_message, suggested_questions, is_active, user_id')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Zjisti plán vlastníka bota pro show_badge
  const { data: user } = await db
    .from('users')
    .select('plan')
    .eq('id', data.user_id)
    .single()

  const plan = (user?.plan ?? 'hobby') as Plan
  const planLimits = PLAN_LIMITS[plan] ?? PLAN_LIMITS['hobby']
  const show_badge = !planLimits.remove_badge

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user_id, ...botConfig } = data
  return NextResponse.json({ ...botConfig, show_badge }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  })
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
