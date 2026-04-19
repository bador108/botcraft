'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, Bot, CreditCard, FileText, BarChart2, Settings, ExternalLink, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clerkAppearance } from '@/lib/clerk-theme'

const nav = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/chatbots',   label: 'Chatboty',   icon: Bot },
  { href: '/documents',  label: 'Dokumenty',  icon: FileText },
  { href: '/analytics',  label: 'Analytika',  icon: BarChart2 },
  { href: '/billing',    label: 'Fakturace',  icon: CreditCard },
  { href: '/settings',   label: 'Nastavení',  icon: Settings },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname()
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = path === href || (href !== '/dashboard' && path.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-sm font-mono uppercase tracking-wider transition-colors',
              active
                ? 'text-rust border-l-2 border-rust pl-[10px]'
                : 'text-muted hover:text-ink border-l-2 border-transparent pl-[10px]'
            )}
          >
            <Icon className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-rust' : 'text-muted')} />
            {label}
          </Link>
        )
      })}

      {/* Oddělovač + externý odkaz */}
      <div className="pt-3 mt-3 border-t border-paper_border">
        <a
          href="https://docs.botcraft.app"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-mono uppercase tracking-wider text-muted hover:text-ink border-l-2 border-transparent pl-[10px] transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted" />
          Dokumentace
        </a>
      </div>
    </nav>
  )
}

function SidebarLogo() {
  return (
    <div className="px-5 py-5 border-b border-paper_border">
      <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
        <Image src="/icon.svg" alt="BotCraft" width={20} height={20} />
        <span className="font-mono text-sm font-medium text-ink tracking-tight">BotCraft</span>
      </Link>
    </div>
  )
}

function UserSection() {
  return (
    <div className="px-4 py-4 border-t border-paper_border">
      <div className="flex items-center gap-2.5">
        <UserButton appearance={clerkAppearance} />
        <span className="font-mono text-[11px] text-muted uppercase tracking-wider">Účet</span>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <aside className="w-52 shrink-0 hidden md:flex flex-col h-screen bg-bone border-r border-paper_border sticky top-0">
        <SidebarLogo />
        <NavLinks />
        <UserSection />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-bone border-b border-paper_border flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="BotCraft" width={20} height={20} />
          <span className="font-mono text-sm font-medium text-ink">BotCraft</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="h-9 w-9 flex items-center justify-center text-muted hover:text-ink transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <aside className="relative w-60 bg-bone flex flex-col h-full border-r border-paper_border">
            <div className="flex items-center justify-between px-5 py-4 border-b border-paper_border">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/icon.svg" alt="BotCraft" width={20} height={20} />
                <span className="font-mono text-sm font-medium text-ink">BotCraft</span>
              </Link>
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <UserSection />
          </aside>
        </div>
      )}
    </>
  )
}
