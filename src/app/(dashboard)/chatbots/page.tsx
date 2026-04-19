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
          <h1 className="text-2xl font-bold text-ink tracking-tight">Chatboti</h1>
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
        <div className="bg-white rounded-xl border border-paper_border border-dashed shadow-sm px-6 py-14 text-center">
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
          {typedBots.map((bot) => {
            const tier = legacyModelToTier(bot.model)
            const modelLabel = MODELS[tier].label
            return (
              <div key={bot.id} className="flex items-center gap-4 px-5 py-4 hover:bg-bone transition-colors group">
                <span className="text-xl shrink-0">{bot.avatar}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-ink text-sm truncate">{bot.name}</p>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ${
                      bot.is_active
                        ? 'bg-success/10 text-success'
                        : 'bg-bone text-muted'
                    }`}>
                      {bot.is_active ? 'Aktivní' : 'Neaktivní'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {bot.message_count_month} zpráv/měs
                    </span>
                    <span>·</span>
                    <span className="bg-bone px-2 py-0.5 rounded-full text-muted font-medium">
                      {modelLabel}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/chatbots/${bot.id}`}
                  className="flex items-center gap-1.5 text-sm text-muted px-3 py-1.5 rounded-lg hover:bg-bone hover:text-ink transition-colors"
                >
                  Nastavení
                  <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
