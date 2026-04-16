'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, BookOpen, Code, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Settings',      icon: Settings,       suffix: '' },
  { label: 'Knowledge',     icon: BookOpen,        suffix: '/knowledge' },
  { label: 'Embed',         icon: Code,            suffix: '/embed' },
  { label: 'Conversations', icon: MessageSquare,   suffix: '/conversations' },
]

export function BotNav({ botId }: { botId: string }) {
  const path = usePathname()

  return (
    <div className="flex items-center gap-1 border-b border-white/[0.06] mb-7 -mt-2">
      {tabs.map(({ label, icon: Icon, suffix }) => {
        const href = `/chatbots/${botId}${suffix}`
        const active = suffix === ''
          ? path === href
          : path.startsWith(href)
        return (
          <Link
            key={suffix}
            href={href}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 text-sm font-medium border-b-[2px] -mb-px transition-colors',
              active
                ? 'text-white border-indigo-500'
                : 'text-zinc-500 border-transparent hover:text-zinc-300'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
