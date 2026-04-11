import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, MessageSquare, FileText, Plus, ArrowRight } from 'lucide-react'
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your AI chatbots at a glance
          </p>
        </div>
        <Link href="/chatbots/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Chatbot
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{typedBots.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Chatbots{limits.chatbots !== Infinity ? ` / ${limits.chatbots}` : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMessages}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Messages this month{limits.messages_per_month !== Infinity ? ` / ${limits.messages_per_month}` : ''}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{plan}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Current plan</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Chatbot list */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Your Chatbots</h2>
        {typedBots.length === 0 ? (
          <Card className="p-10 text-center">
            <Bot className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">No chatbots yet</p>
            <Link href="/chatbots/new">
              <Button>
                <Plus className="h-4 w-4" />
                Create your first chatbot
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typedBots.map(bot => (
              <Card key={bot.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{bot.avatar}</span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{bot.name}</p>
                      <p className="text-xs text-gray-500">{bot.message_count_month} msgs/mo</p>
                    </div>
                  </div>
                  <Badge variant={bot.is_active ? 'success' : 'default'}>
                    {bot.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <Link href={`/chatbots/${bot.id}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Manage <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade banner for free users */}
      {plan === 'free' && (
        <Card className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Upgrade to Pro</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">5 chatbots, 2000 msgs/month, all AI models</p>
            </div>
            <Link href="/billing">
              <Button size="sm">Upgrade — $9/mo</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
