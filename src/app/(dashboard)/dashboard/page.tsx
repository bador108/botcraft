import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { getCurrentUsage } from '@/lib/usage'
import { Button } from '@/components/ui/button'
import { BotAvatar } from '@/components/ui/bot-avatar'
import { Bot, Plus, ArrowRight, MessageSquare, Zap } from 'lucide-react'
import type { User, Chatbot } from '@/types'

export default async function DashboardPage() {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: user }, { data: chatbots }, usage] = await Promise.all([
    db.from('users').select('*').eq('id', userId!).single(),
    db.from('chatbots').select('*').eq('user_id', userId!).order('created_at', { ascending: false }),
    getCurrentUsage(userId!),
  ])

  const typedUser = user as User | null
  const typedBots = (chatbots ?? []) as Chatbot[]
  const plan = typedUser?.plan ?? 'hobby'
  const limits = PLAN_LIMITS[plan]
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const msgLeft = limits.messages_per_month === Infinity
    ? null
    : Math.max(0, limits.messages_per_month - usage.messageCount)
  const msgPercent = limits.messages_per_month === Infinity
    ? 0
    : Math.min(100, (usage.messageCount / limits.messages_per_month) * 100)
  const isWarning = msgPercent >= 80
  const isCritical = msgPercent >= 95

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Přehled</h1>
          <p className="text-sm text-muted mt-0.5">Plán: <span className="font-medium text-ink">{planLabel}</span></p>
        </div>
        <Link href="/chatbots/new">
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Nový chatbot
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 bg-rust/10 rounded-lg flex items-center justify-center">
              <Bot className="h-4 w-4 text-rust" />
            </div>
          </div>
          <p className="text-2xl font-bold text-ink">
            {typedBots.length}
            {limits.chatbots !== Infinity && (
              <span className="text-base font-normal text-muted"> / {limits.chatbots}</span>
            )}
          </p>
          <p className="text-sm text-muted mt-0.5">Chatboti</p>
        </div>

        <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 bg-rust/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-rust" />
            </div>
          </div>
          <p className="text-2xl font-bold text-ink">
            {usage.messageCount.toLocaleString('cs-CZ')}
          </p>
          <p className="text-sm text-muted mt-0.5">Zprávy tento měsíc</p>
        </div>

        <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5 col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 bg-rust/10 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-rust" />
            </div>
          </div>
          <p className="text-2xl font-bold text-ink capitalize">{planLabel}</p>
          <p className="text-sm text-muted mt-0.5">Aktuální plán</p>
        </div>
      </div>

      {/* Usage bar */}
      {limits.messages_per_month !== Infinity && (
        <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink">Využití zpráv</p>
            <span className={`text-sm font-medium ${isCritical ? 'text-rust' : isWarning ? 'text-amber-600' : 'text-muted'}`}>
              {msgLeft} zbývá
            </span>
          </div>
          <div className="h-2 bg-bone rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all ${
                isCritical ? 'bg-rust' : isWarning ? 'bg-amber-500' : 'bg-rust'
              }`}
              style={{ width: `${msgPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">
              {usage.messageCount.toLocaleString('cs-CZ')} / {limits.messages_per_month.toLocaleString('cs-CZ')} zpráv
            </p>
            {(plan === 'hobby' || plan === 'free') && (
              <Link
                href="/billing"
                className="text-xs font-medium text-rust hover:text-rust_hover transition-colors"
              >
                Upgrade na Maker →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Chatbot list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-ink">Chatboti</h2>
          {typedBots.length > 0 && (
            <Link
              href="/chatbots/new"
              className="text-xs font-medium text-muted hover:text-ink transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Nový
            </Link>
          )}
        </div>

        {typedBots.length === 0 ? (
          <div className="bg-white rounded-xl border border-paper_border border-dashed shadow-sm px-6 py-12 text-center">
            <div className="h-12 w-12 bg-bone rounded-xl flex items-center justify-center mx-auto mb-4">
              <Bot className="h-6 w-6 text-muted" />
            </div>
            <p className="font-semibold text-ink mb-1">Zatím žádný chatbot</p>
            <p className="text-sm text-muted mb-6">Vytvoř ho za méně než 2 minuty</p>
            <Link href="/chatbots/new">
              <Button variant="primary">
                <Plus className="h-4 w-4" />
                Vytvořit prvního chatbota
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden divide-y divide-paper_border">
            {typedBots.map((bot) => (
              <Link
                key={bot.id}
                href={`/chatbots/${bot.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-bone transition-colors group"
              >
                <BotAvatar avatar={bot.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink text-sm">{bot.name}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {bot.message_count_month} zpráv tento měsíc
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    bot.is_active
                      ? 'bg-success/10 text-success'
                      : 'bg-bone text-muted'
                  }`}>
                    {bot.is_active ? 'Aktivní' : 'Neaktivní'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-ink transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
