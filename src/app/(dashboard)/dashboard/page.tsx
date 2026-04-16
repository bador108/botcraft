import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { Button } from '@/components/ui/button'
import { Bot, Plus, ArrowRight, MessageSquare, TrendingUp } from 'lucide-react'
import type { User, Chatbot } from '@/types'

export default async function DashboardPage() {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: user }, { data: chatbots }] = await Promise.all([
    db.from('users').select('*').eq('id', userId!).single(),
    db.from('chatbots').select('*').eq('user_id', userId!).order('created_at', { ascending: false }),
  ])

  const typedUser = user as User | null
  const typedBots = (chatbots ?? []) as Chatbot[]
  const plan = typedUser?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]
  const totalMessages = typedBots.reduce((sum, b) => sum + b.message_count_month, 0)

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-600 mt-0.5">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} plan
          </p>
        </div>
        <Link href="/chatbots/new">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" />
            New chatbot
          </Button>
        </Link>
      </div>

      {/* Stats — inline, minimal */}
      <div className="flex flex-wrap gap-8 py-5 border-y border-white/[0.06]">
        <div>
          <p className="text-2xl font-bold text-white font-display">
            {typedBots.length}
            {limits.chatbots !== Infinity && (
              <span className="text-sm font-normal text-zinc-600"> / {limits.chatbots}</span>
            )}
          </p>
          <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1.5">
            <Bot className="h-3 w-3" />
            Chatbots
          </p>
        </div>
        <div className="w-px bg-white/[0.06] hidden sm:block" />
        <div>
          <p className="text-2xl font-bold text-white font-display">
            {totalMessages}
            {limits.messages_per_month !== Infinity && (
              <span className="text-sm font-normal text-zinc-600"> / {limits.messages_per_month}</span>
            )}
          </p>
          <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" />
            Messages this month
          </p>
        </div>
        {plan !== 'business' && (
          <>
            <div className="w-px bg-white/[0.06] hidden sm:block" />
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-indigo-400">
                  {plan === 'free' ? 'Pro — 250 Kč/měs.' : 'Business — 750 Kč/měs.'}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5 flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3" />
                  {plan === 'free' ? '5 chatbots, all models' : 'Unlimited everything'}
                </p>
              </div>
              <Link href="/billing">
                <Button size="sm" variant="secondary">Upgrade</Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Chatbot list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-zinc-600 uppercase tracking-[0.12em] font-medium">Your chatbots</p>
          {typedBots.length > 0 && (
            <Link href="/chatbots/new" className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1">
              <Plus className="h-3 w-3" /> New
            </Link>
          )}
        </div>

        {typedBots.length === 0 ? (
          <div className="border border-white/[0.06] rounded-xl px-6 py-12 text-center">
            <Bot className="h-8 w-8 text-zinc-800 mx-auto mb-3" />
            <p className="text-sm text-zinc-500 mb-1">No chatbots yet</p>
            <p className="text-xs text-zinc-700 mb-5">Create one in under 2 minutes</p>
            <Link href="/chatbots/new">
              <Button>
                <Plus className="h-3.5 w-3.5" />
                Create your first chatbot
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border border-white/[0.06] rounded-xl overflow-hidden divide-y divide-white/[0.04]">
            {typedBots.map((bot) => (
              <Link
                key={bot.id}
                href={`/chatbots/${bot.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group"
              >
                <span className="text-xl shrink-0">{bot.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{bot.name}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{bot.message_count_month} msgs this month</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                    bot.is_active
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}>
                    {bot.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
