import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { getCurrentUsage } from '@/lib/usage'
import { Button } from '@/components/ui/button'
import { Bot, Plus, ArrowRight, MessageSquare } from 'lucide-react'
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
  const plan = typedUser?.plan ?? 'hobby'
  const limits = PLAN_LIMITS[plan]
  const usage = await getCurrentUsage(userId!)
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const msgLeft = limits.messages_per_month === Infinity
    ? null
    : Math.max(0, limits.messages_per_month - usage.messageCount)
  const msgPercent = limits.messages_per_month === Infinity
    ? 0
    : Math.min(100, (usage.messageCount / limits.messages_per_month) * 100)

  const now = new Date()
  const monthLabel = now.toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-medium text-ink uppercase tracking-tight">
            Tvoji chatboti
          </h1>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
            Plán: {planLabel}
          </p>
        </div>
        <Link href="/chatbots/new">
          <Button variant="primary" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Nový chatbot
          </Button>
        </Link>
      </div>

      {/* Usage card */}
      {limits.messages_per_month !== Infinity && (
        <div className="border border-paper_border bg-paper p-5" style={{ borderRadius: '2px' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[11px] text-muted uppercase tracking-wider">
              Zprávy · {monthLabel}
            </p>
            <span className="font-mono text-[11px] text-muted">
              {msgLeft} zbývá
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-bone border border-paper_border overflow-hidden mb-2" style={{ borderRadius: '1px' }}>
            <div
              className="h-full bg-rust transition-all"
              style={{ width: `${msgPercent}%`, borderRadius: '1px' }}
            />
          </div>
          <p className="font-mono text-sm text-ink">
            {usage.messageCount.toLocaleString('cs-CZ')}
            <span className="text-muted"> / {limits.messages_per_month.toLocaleString('cs-CZ')} zpráv</span>
          </p>
          {(plan === 'hobby' || plan === 'free') && (
            <Link
              href="/billing"
              className="inline-block mt-3 font-mono text-[11px] text-rust uppercase tracking-wider hover:text-rust_hover transition-colors"
            >
              Upgrade na Maker (4 000 zpráv) →
            </Link>
          )}
        </div>
      )}

      {/* Stats strip */}
      <div className="flex flex-wrap gap-8 py-5 border-y border-paper_border">
        <div>
          <p className="font-mono text-2xl font-medium text-ink">
            {typedBots.length}
            {limits.chatbots !== Infinity && (
              <span className="text-base font-normal text-muted"> / {limits.chatbots}</span>
            )}
          </p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <Bot className="h-3 w-3" />
            Chatboti
          </p>
        </div>
        <div className="w-px bg-paper_border hidden sm:block" />
        <div>
          <p className="font-mono text-2xl font-medium text-ink">
            {usage.messageCount.toLocaleString('cs-CZ')}
          </p>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1 flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" />
            Zprávy tento měsíc
          </p>
        </div>
      </div>

      {/* Chatbot list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider">Chatboti</p>
          {typedBots.length > 0 && (
            <Link
              href="/chatbots/new"
              className="font-mono text-[11px] text-muted uppercase tracking-wider hover:text-ink transition-colors flex items-center gap-1"
            >
              <Plus className="h-3 w-3" /> Nový
            </Link>
          )}
        </div>

        {typedBots.length === 0 ? (
          <div className="border border-paper_border border-dashed px-6 py-12 text-center" style={{ borderRadius: '2px' }}>
            <Bot className="h-8 w-8 text-muted mx-auto mb-3" />
            <p className="font-mono text-sm text-ink uppercase tracking-wide mb-1">Zatím žádný chatbot</p>
            <p className="text-sm text-muted mb-6">Vytvoř ho za méně než 2 minuty</p>
            <Link href="/chatbots/new">
              <Button variant="primary">
                <Plus className="h-3.5 w-3.5" />
                Vytvořit prvního chatbota
              </Button>
            </Link>
          </div>
        ) : (
          <div className="border border-paper_border divide-y divide-paper_border" style={{ borderRadius: '2px' }}>
            {typedBots.map((bot) => (
              <Link
                key={bot.id}
                href={`/chatbots/${bot.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-paper transition-colors group"
              >
                <span className="text-xl shrink-0">{bot.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-medium text-ink">{bot.name}</p>
                  <p className="font-mono text-[11px] text-muted mt-0.5 uppercase tracking-wider">
                    {bot.message_count_month} zpráv tento měsíc
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-mono text-[10px] px-2 py-0.5 border uppercase tracking-wider ${
                    bot.is_active
                      ? 'text-success border-success bg-success/5'
                      : 'text-muted border-paper_border'
                  }`} style={{ borderRadius: '2px' }}>
                    {bot.is_active ? 'Aktivní' : 'Neaktivní'}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted group-hover:text-ink transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
