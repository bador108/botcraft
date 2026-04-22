import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { BotNav } from '@/components/dashboard/bot-nav'
import { BotAvatar } from '@/components/ui/bot-avatar'
import { MessageSquare, User, Bot } from 'lucide-react'
import type { Chatbot, Message } from '@/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('cs-CZ', {
    hour: '2-digit', minute: '2-digit',
  })
}

function groupByDay(messages: Message[]) {
  const groups: Record<string, Message[]> = {}
  for (const m of messages) {
    const day = m.created_at.slice(0, 10)
    if (!groups[day]) groups[day] = []
    groups[day].push(m)
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]))
}

export default async function ConversationsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: chatbot }, { data: messages }] = await Promise.all([
    db.from('chatbots').select('id, name, avatar').eq('id', params.id).eq('user_id', userId!).single(),
    db.from('messages')
      .select('*')
      .eq('chatbot_id', params.id)
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  if (!chatbot) notFound()

  const typedMessages = (messages ?? []) as Message[]
  const grouped = groupByDay(typedMessages)
  const totalUser = typedMessages.filter(m => m.role === 'user').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BotAvatar avatar={(chatbot as Chatbot).avatar} size="md" />
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">
            {(chatbot as Chatbot).name}
          </h1>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-0.5">Konverzace</p>
        </div>
      </div>

      <BotNav botId={params.id} />

      {/* Stats strip */}
      <div className="flex flex-wrap gap-8 py-5 border-y border-paper_border">
        <div>
          <p className="font-mono text-2xl font-medium text-ink">{typedMessages.length}</p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">Zpráv celkem</p>
        </div>
        <div className="w-px bg-paper_border hidden sm:block" />
        <div>
          <p className="font-mono text-2xl font-medium text-ink">{totalUser}</p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">Zpráv od uživatelů</p>
        </div>
        <div className="w-px bg-paper_border hidden sm:block" />
        <div>
          <p className="font-mono text-2xl font-medium text-ink">{grouped.length}</p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">Aktivní dny</p>
        </div>
      </div>

      {/* Empty state */}
      {typedMessages.length === 0 && (
        <div className="border border-paper_border border-dashed py-16 text-center" style={{ borderRadius: '2px' }}>
          <MessageSquare className="h-8 w-8 text-muted mx-auto mb-3" />
          <p className="font-mono text-sm text-ink uppercase tracking-wide mb-1">Zatím žádné konverzace</p>
          <p className="text-sm text-muted">Zprávy se zobrazí jakmile uživatelé začnou chatovat</p>
        </div>
      )}

      {/* Message groups by day */}
      <div className="space-y-8">
        {grouped.map(([day, msgs]) => (
          <div key={day}>
            <div className="flex items-center gap-3 mb-4">
              <p className="font-mono text-[11px] text-muted uppercase tracking-wider">{formatDate(day)}</p>
              <div className="flex-1 h-px bg-paper_border" />
              <p className="font-mono text-[11px] text-muted">{msgs.filter(m => m.role === 'user').length} zpráv</p>
            </div>

            <div className="border border-paper_border divide-y divide-paper_border overflow-hidden" style={{ borderRadius: '2px' }}>
              {[...msgs].reverse().map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 px-4 py-3 ${msg.role === 'user' ? 'bg-bone' : 'bg-paper'}`}
                >
                  <div className={`h-6 w-6 flex items-center justify-center shrink-0 mt-0.5 border ${
                    msg.role === 'user'
                      ? 'bg-bone border-paper_border text-muted'
                      : 'bg-rust/10 border-rust/20 text-rust'
                  }`} style={{ borderRadius: '2px' }}>
                    {msg.role === 'user'
                      ? <User className="h-3 w-3" />
                      : <Bot className="h-3 w-3" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
                        {msg.role === 'user' ? 'Uživatel' : (chatbot as Chatbot).name}
                      </span>
                      <span className="font-mono text-[11px] text-muted">{formatTime(msg.created_at)}</span>
                    </div>
                    <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {typedMessages.length >= 200 && (
        <p className="font-mono text-[11px] text-muted text-center mt-6">Zobrazeno posledních 200 zpráv</p>
      )}
    </div>
  )
}
