import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { Button } from '@/components/ui/button'
import { Bot, Plus, ArrowRight, MessageSquare, FileText } from 'lucide-react'
import type { User, Chatbot } from '@/types'

export default async function ChatbotsPage() {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: user }, { data: chatbots }] = await Promise.all([
    db.from('users').select('plan').eq('id', userId!).single(),
    db.from('chatbots').select('*').eq('user_id', userId!).order('created_at', { ascending: false }),
  ])

  const plan = (user as User | null)?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]
  const typedBots = (chatbots ?? []) as Chatbot[]
  const canCreate = limits.chatbots === Infinity || typedBots.length < limits.chatbots

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-white tracking-tight">Chatbots</h1>
          <p className="text-sm text-zinc-600 mt-0.5">
            {typedBots.length}
            {limits.chatbots !== Infinity ? ` / ${limits.chatbots}` : ''} chatbots
          </p>
        </div>
        {canCreate ? (
          <Link href="/chatbots/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              New chatbot
            </Button>
          </Link>
        ) : (
          <Link href="/billing">
            <Button size="sm" variant="secondary">Upgrade for more</Button>
          </Link>
        )}
      </div>

      {typedBots.length === 0 ? (
        <div className="border border-white/[0.06] rounded-xl px-6 py-14 text-center">
          <Bot className="h-9 w-9 text-zinc-800 mx-auto mb-3" />
          <p className="text-sm text-white mb-1 font-medium">No chatbots yet</p>
          <p className="text-xs text-zinc-600 mb-5">Create your first chatbot and embed it anywhere</p>
          <Link href="/chatbots/new">
            <Button><Plus className="h-3.5 w-3.5" /> Create chatbot</Button>
          </Link>
        </div>
      ) : (
        <div className="border border-white/[0.06] rounded-xl overflow-hidden divide-y divide-white/[0.04]">
          {typedBots.map((bot) => (
            <div key={bot.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.01] transition-colors group">
              <span className="text-2xl shrink-0">{bot.avatar}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-medium text-white text-sm truncate">{bot.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                    bot.is_active
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}>
                    {bot.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {bot.message_count_month} msgs/mo
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {bot.model.split('-').slice(0, 2).join(' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/chatbots/${bot.id}/conversations`}
                  className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  Conversations
                </Link>
                <Link
                  href={`/chatbots/${bot.id}/embed`}
                  className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  Embed
                </Link>
                <Link
                  href={`/chatbots/${bot.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-colors"
                >
                  Settings
                  <ArrowRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
