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

  const plan = (user as User | null)?.plan ?? 'hobby'
  const bot = chatbot as Chatbot

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">{bot.avatar}</span>
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">{bot.name}</h1>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-0.5">Nastavení</p>
        </div>
      </div>

      <BotNav botId={params.id} />

      {/* Quick stats strip */}
      <div className="flex flex-wrap gap-8 py-5 border-y border-paper_border">
        <div>
          <p className="font-mono text-2xl font-medium text-ink">{bot.message_count_month}</p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" /> Zprávy tento měsíc
          </p>
        </div>
        <div className="w-px bg-paper_border hidden sm:block" />
        <div>
          <p className="font-mono text-2xl font-medium text-ink">{docs?.length ?? 0}</p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <FileText className="h-3 w-3" /> Dokumenty
          </p>
        </div>
        <div className="w-px bg-paper_border hidden sm:block" />
        <div>
          <p className="font-mono text-2xl font-medium text-ink">{msgCount ?? 0}</p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" /> Zpráv celkem
          </p>
        </div>
        <div className="w-px bg-paper_border hidden sm:block" />
        <div>
          <p className="font-mono text-sm font-medium text-ink">{formatDate(bot.created_at)}</p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <Calendar className="h-3 w-3" /> Vytvořeno
          </p>
        </div>
      </div>

      <ChatbotForm chatbot={bot} plan={plan} />
    </div>
  )
}
