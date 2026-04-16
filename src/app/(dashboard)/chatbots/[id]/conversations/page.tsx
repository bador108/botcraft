import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { BotNav } from '@/components/dashboard/bot-nav'
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
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-2xl">{(chatbot as Chatbot).avatar}</span>
        <div>
          <h1 className="font-display font-semibold text-white text-lg tracking-tight">
            {(chatbot as Chatbot).name}
          </h1>
          <p className="text-xs text-zinc-600 mt-0.5">Conversations</p>
        </div>
      </div>

      <BotNav botId={params.id} />

      {/* Stats */}
      <div className="flex gap-6 mb-8">
        <div>
          <p className="text-xl font-bold text-white font-display">{typedMessages.length}</p>
          <p className="text-xs text-zinc-600 mt-0.5">Total messages</p>
        </div>
        <div className="w-px bg-white/[0.06]" />
        <div>
          <p className="text-xl font-bold text-white font-display">{totalUser}</p>
          <p className="text-xs text-zinc-600 mt-0.5">User messages</p>
        </div>
        <div className="w-px bg-white/[0.06]" />
        <div>
          <p className="text-xl font-bold text-white font-display">{grouped.length}</p>
          <p className="text-xs text-zinc-600 mt-0.5">Active days</p>
        </div>
      </div>

      {/* Empty state */}
      {typedMessages.length === 0 && (
        <div className="border border-white/[0.06] rounded-xl py-16 text-center">
          <MessageSquare className="h-8 w-8 text-zinc-800 mx-auto mb-3" />
          <p className="text-sm text-zinc-500 mb-1">No conversations yet</p>
          <p className="text-xs text-zinc-700">Messages will appear here once users interact with your bot</p>
        </div>
      )}

      {/* Message groups by day */}
      <div className="space-y-8">
        {grouped.map(([day, msgs]) => (
          <div key={day}>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-xs font-medium text-zinc-500">{formatDate(day)}</p>
              <div className="flex-1 h-px bg-white/[0.05]" />
              <p className="text-xs text-zinc-700">{msgs.filter(m => m.role === 'user').length} messages</p>
            </div>

            <div className="border border-white/[0.06] rounded-xl overflow-hidden divide-y divide-white/[0.04]">
              {[...msgs].reverse().map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 px-4 py-3 ${
                    msg.role === 'user' ? 'bg-transparent' : 'bg-white/[0.01]'
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-zinc-800 text-zinc-400'
                      : 'bg-indigo-950/60 text-indigo-400 border border-indigo-900/40'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="h-3 w-3" />
                      : <Bot className="h-3 w-3" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-medium text-zinc-500">
                        {msg.role === 'user' ? 'User' : (chatbot as Chatbot).name}
                      </span>
                      <span className="text-[11px] text-zinc-700">{formatTime(msg.created_at)}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {typedMessages.length >= 200 && (
        <p className="text-xs text-zinc-700 text-center mt-6">Showing last 200 messages</p>
      )}
    </div>
  )
}
