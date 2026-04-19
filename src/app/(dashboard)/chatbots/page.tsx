import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { MODELS, legacyModelToTier } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { Bot, Plus, ArrowRight, MessageSquare } from 'lucide-react'
import type { User, Chatbot } from '@/types'

export default async function ChatbotsPage() {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: user }, { data: chatbots }] = await Promise.all([
    db.from('users').select('plan').eq('id', userId!).single(),
    db.from('chatbots').select('*').eq('user_id', userId!).order('created_at', { ascending: false }),
  ])

  const plan = (user as User | null)?.plan ?? 'hobby'
  const limits = PLAN_LIMITS[plan]
  const typedBots = (chatbots ?? []) as Chatbot[]
  const canCreate = limits.chatbots === Infinity || typedBots.length < limits.chatbots

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-medium text-ink uppercase tracking-tight">Chatboti</h1>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
            {typedBots.length}
            {limits.chatbots !== Infinity ? ` / ${limits.chatbots}` : ''} chatbotů
          </p>
        </div>
        {canCreate ? (
          <Link href="/chatbots/new">
            <Button variant="primary" size="sm">
              <Plus className="h-3.5 w-3.5" />
              Nový chatbot
            </Button>
          </Link>
        ) : (
          <Link href="/billing">
            <Button variant="secondary" size="sm">Upgrade pro více →</Button>
          </Link>
        )}
      </div>

      {/* List */}
      {typedBots.length === 0 ? (
        <div className="border border-paper_border border-dashed px-6 py-14 text-center" style={{ borderRadius: '2px' }}>
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
          {typedBots.map((bot) => {
            const tier = legacyModelToTier(bot.model)
            const modelLabel = MODELS[tier].label
            return (
              <div key={bot.id} className="flex items-center gap-4 px-5 py-4 hover:bg-paper transition-colors group">
                <span className="text-xl shrink-0">{bot.avatar}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-mono text-sm font-medium text-ink truncate">{bot.name}</p>
                    {/* Status badge */}
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 border uppercase tracking-wider shrink-0 ${
                        bot.is_active
                          ? 'text-success border-success bg-success/5'
                          : 'text-muted border-paper_border'
                      }`}
                      style={{ borderRadius: '2px' }}
                    >
                      {bot.is_active ? 'Aktivní' : 'Neaktivní'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-muted">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {bot.message_count_month} zpráv/měs
                    </span>
                    <span>·</span>
                    {/* Model badge — only public label, no internal ID */}
                    <span className="border border-paper_border px-1.5 py-0.5 uppercase tracking-wider" style={{ borderRadius: '2px' }}>
                      {modelLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/chatbots/${bot.id}`}
                    className="flex items-center gap-1.5 font-mono text-[11px] text-muted uppercase tracking-wider px-3 py-1.5 hover:text-ink hover:bg-paper border border-transparent hover:border-paper_border transition-colors"
                    style={{ borderRadius: '2px' }}
                  >
                    Nastavení
                    <ArrowRight className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
