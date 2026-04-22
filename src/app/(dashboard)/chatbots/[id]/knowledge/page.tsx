import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { KnowledgeBase } from '@/components/chatbot/knowledge-base'
import { BotNav } from '@/components/dashboard/bot-nav'
import { BotAvatar } from '@/components/ui/bot-avatar'
import type { User, Chatbot, Document } from '@/types'

export default async function KnowledgePage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: chatbot }, { data: user }, { data: documents }] = await Promise.all([
    db.from('chatbots').select('id, name, avatar').eq('id', params.id).eq('user_id', userId!).single(),
    db.from('users').select('plan').eq('id', userId!).single(),
    db.from('documents').select('*').eq('chatbot_id', params.id).order('created_at', { ascending: false }),
  ])

  if (!chatbot) notFound()

  const plan = (user as User | null)?.plan ?? 'free'

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <BotAvatar avatar={(chatbot as Chatbot).avatar} size="md" />
        <div>
          <h1 className="font-display font-semibold text-white text-lg tracking-tight">
            {(chatbot as Chatbot).name}
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">Knowledge Base</p>
        </div>
      </div>

      <BotNav botId={params.id} />

      <KnowledgeBase
        chatbotId={params.id}
        initialDocuments={(documents ?? []) as Document[]}
        plan={plan}
      />
    </div>
  )
}
