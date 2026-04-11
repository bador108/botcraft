import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, Plus, Settings, BookOpen, Code } from 'lucide-react'
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chatbots</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {typedBots.length}{limits.chatbots !== Infinity ? ` / ${limits.chatbots}` : ''} chatbots
          </p>
        </div>
        {canCreate ? (
          <Link href="/chatbots/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Chatbot
            </Button>
          </Link>
        ) : (
          <Link href="/billing">
            <Button size="sm" variant="secondary">Upgrade for more</Button>
          </Link>
        )}
      </div>

      {typedBots.length === 0 ? (
        <Card className="p-16 text-center">
          <Bot className="h-12 w-12 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
          <p className="font-semibold text-gray-900 dark:text-white mb-1">No chatbots yet</p>
          <p className="text-sm text-gray-500 mb-6">Create your first chatbot and embed it anywhere</p>
          <Link href="/chatbots/new">
            <Button><Plus className="h-4 w-4" /> Create Chatbot</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {typedBots.map(bot => (
            <Card key={bot.id} className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl shrink-0">{bot.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">{bot.name}</p>
                    <Badge variant={bot.is_active ? 'success' : 'default'}>
                      {bot.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {bot.message_count_month} messages · {bot.model}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/chatbots/${bot.id}/knowledge`}>
                    <Button variant="ghost" size="sm">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/chatbots/${bot.id}/embed`}>
                    <Button variant="ghost" size="sm">
                      <Code className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/chatbots/${bot.id}`}>
                    <Button variant="secondary" size="sm">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
