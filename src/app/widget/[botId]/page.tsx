export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { WidgetChat } from './widget-chat'

export default async function WidgetPage({ params, searchParams }: {
  params: { botId: string }
  searchParams: { domain?: string }
}) {
  const db = createServiceClient()
  const { data: bot } = await db
    .from('chatbots')
    .select('id, name, avatar, theme_color, welcome_message, suggested_questions, is_active')
    .eq('id', params.botId)
    .eq('is_active', true)
    .single()

  if (!bot) notFound()

  return <WidgetChat bot={bot} domain={searchParams.domain} />
}
