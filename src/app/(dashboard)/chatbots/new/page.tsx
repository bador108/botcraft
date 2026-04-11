import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/lib/plans'
import { ChatbotForm } from '@/components/chatbot/chatbot-form'
import type { User } from '@/types'

export default async function NewChatbotPage() {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: user }, { count }] = await Promise.all([
    db.from('users').select('plan').eq('id', userId!).single(),
    db.from('chatbots').select('*', { count: 'exact', head: true }).eq('user_id', userId!),
  ])

  const plan = (user as User | null)?.plan ?? 'free'
  const limits = PLAN_LIMITS[plan]

  if (limits.chatbots !== Infinity && (count ?? 0) >= limits.chatbots) {
    redirect('/billing')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Chatbot</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your AI chatbot</p>
      </div>
      <ChatbotForm plan={plan} />
    </div>
  )
}
