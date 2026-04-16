import { auth } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { ChatbotForm } from '@/components/chatbot/chatbot-form'
import { Button } from '@/components/ui/button'
import { BookOpen, Code } from 'lucide-react'
import type { User, Chatbot } from '@/types'

export default async function ChatbotSettingsPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  const db = createServiceClient()

  const [{ data: chatbot }, { data: user }] = await Promise.all([
    db.from('chatbots').select('*').eq('id', params.id).eq('user_id', userId!).single(),
    db.from('users').select('plan').eq('id', userId!).single(),
  ])

  if (!chatbot) notFound()

  const plan = (user as User | null)?.plan ?? 'free'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>{(chatbot as Chatbot).avatar}</span>
            {(chatbot as Chatbot).name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Settings</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/chatbots/${params.id}/knowledge`}>
            <Button variant="secondary" size="sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Knowledge Base</span>
            </Button>
          </Link>
          <Link href={`/chatbots/${params.id}/embed`}>
            <Button variant="secondary" size="sm">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Embed</span>
            </Button>
          </Link>
        </div>
      </div>
      <ChatbotForm chatbot={chatbot as Chatbot} plan={plan} />
    </div>
  )
}
