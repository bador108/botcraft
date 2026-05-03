import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS, getEffectivePlan } from '@/lib/plans'
import type { User } from '@/types'

async function ensureUser(userId: string) {
  const db = createServiceClient()
  const { data } = await db.from('users').select('id').eq('id', userId).single()
  if (!data) {
    const clerkUser = await currentUser()
    await db.from('users').insert({
      id: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress ?? '',
      full_name: `${clerkUser?.firstName ?? ''} ${clerkUser?.lastName ?? ''}`.trim(),
    })
  }
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = createServiceClient()
  const { data, error } = await db
    .from('chatbots')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await ensureUser(userId)

  const db = createServiceClient()
  const { data: user } = await db.from('users').select('plan, email').eq('id', userId).single()
  const plan = getEffectivePlan((user as User | null)?.plan ?? 'free', (user as User | null)?.email)
  const limits = PLAN_LIMITS[plan]

  const { count } = await db
    .from('chatbots')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (limits.chatbots !== Infinity && (count ?? 0) >= limits.chatbots) {
    return NextResponse.json({ error: 'Chatbot limit reached. Upgrade your plan.' }, { status: 403 })
  }

  const body = await req.json()
  const { name, avatar, system_prompt, model, theme_color, welcome_message, allowed_domains, is_active } = body

  // Validate model is allowed for plan
  if (!limits.models.includes(model)) {
    return NextResponse.json({ error: 'Model not available on your plan.' }, { status: 403 })
  }

  const { data, error } = await db.from('chatbots').insert({
    user_id: userId,
    name: name?.trim() || 'My Chatbot',
    avatar: avatar || '🤖',
    system_prompt: system_prompt || 'You are a helpful assistant.',
    model,
    theme_color: theme_color || '#6366f1',
    welcome_message: welcome_message || 'Hi! How can I help you?',
    allowed_domains: allowed_domains || [],
    is_active: is_active ?? true,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
