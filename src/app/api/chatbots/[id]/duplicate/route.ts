import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import type { User, Chatbot } from '@/types'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()

  const [{ data: user }, { data: source }, { data: existing }] = await Promise.all([
    db.from('users').select('plan').eq('id', userId).single(),
    db.from('chatbots').select('*').eq('id', params.id).eq('user_id', userId).single(),
    db.from('chatbots').select('id', { count: 'exact' }).eq('user_id', userId),
  ])

  if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const plan = (user as User | null)?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]
  const count = existing?.length ?? 0

  if (limits.chatbots !== Infinity && count >= limits.chatbots) {
    return NextResponse.json({ error: 'Plan limit reached. Upgrade to create more chatbots.' }, { status: 403 })
  }

  const bot = source as Chatbot
  const { data, error } = await db.from('chatbots').insert({
    user_id: userId,
    name: `${bot.name} (copy)`,
    avatar: bot.avatar,
    system_prompt: bot.system_prompt,
    model: bot.model,
    theme_color: bot.theme_color,
    welcome_message: bot.welcome_message,
    allowed_domains: bot.allowed_domains,
    is_active: false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
