import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { ChatbotForm } from '@/components/chatbot/chatbot-form'
import { BotNav } from '@/components/dashboard/bot-nav'
import { MessageSquare, FileText, Calendar } from 'lucide-react'
import type { User, Chatbot } from '@/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function ChatbotSettingsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: chatbot }, { data: user }, { data: docs }, { count: msgCount }] = await Promise.all([
    db.from('chatbots').select('*').eq('id', params.id).eq('user_id', userId!).single(),
    db.from('users').select('plan').eq('id', userId!).single(),
    db.from('documents').select('id', { count: 'exact' }).eq('chatbot_id', params.id),
    db.from('messages').select('*', { count: 'exact', head: true }).eq('chatbot_id', params.id),
  ])

  if (!chatbot) notFound()

  const plan = (user as User | null)?.plan ?? 'free'
  const bot = chatbot as Chatbot

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{bot.avatar}</span>
        <div>
          <h1 className="font-display font-semibold text-white text-lg tracking-tight">{bot.name}</h1>
          <p className="text-xs text-zinc-600 mt-0.5">Settings</p>
        </div>
      </div>

      <BotNav botId={params.id} />

      {/* Quick analytics */}
      <div className="flex flex-wrap gap-6 py-4 mb-7 border-y border-white/[0.06]">
        <div>
          <p className="text-xl font-bold text-white font-display">{bot.message_count_month}</p>
          <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" /> Msgs this month
          </p>
        </div>
        <div className="w-px bg-white/[0.06] hidden sm:block" />
        <div>
          <p className="text-xl font-bold text-white font-display">{docs?.length ?? 0}</p>
          <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1.5">
            <FileText className="h-3 w-3" /> Documents
          </p>
        </div>
        <div className="w-px bg-white/[0.06] hidden sm:block" />
        <div>
          <p className="text-xl font-bold text-white font-display">{msgCount ?? 0}</p>
          <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" /> Total messages
          </p>
        </div>
        <div className="w-px bg-white/[0.06] hidden sm:block" />
        <div>
          <p className="text-sm font-semibold text-white">{formatDate(bot.created_at)}</p>
          <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> Created
          </p>
        </div>
      </div>

      <ChatbotForm chatbot={bot} plan={plan} />
    </div>
  )
}
