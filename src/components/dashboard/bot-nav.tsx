'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, BookOpen, Code, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Nastavení',   icon: Settings,     suffix: '' },
  { label: 'Dokumenty',   icon: BookOpen,     suffix: '/knowledge' },
  { label: 'Embed',       icon: Code,         suffix: '/embed' },
  { label: 'Konverzace',  icon: MessageSquare, suffix: '/conversations' },
]

export function BotNav({ botId }: { botId: string }) {
  const path = usePathname()

  return (
    <div className="flex items-center gap-0 border-b border-paper_border mb-7 -mt-2">
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
              'flex items-center gap-2 px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider border-b-2 -mb-px transition-colors',
              active
                ? 'text-ink border-rust'
                : 'text-muted border-transparent hover:text-ink'
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
