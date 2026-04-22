'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser, useClerk } from '@clerk/nextjs'
import { LayoutDashboard, Bot, CreditCard, FileText, BarChart2, Settings, BookOpen, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { clerkAppearance } from '@/lib/clerk-theme'
import { Logo } from '@/components/Logo'

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
    <nav className="flex-1 px-3 py-3 space-y-0.5">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = href === '/dashboard'
          ? path === href
          : path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
              active
                ? 'bg-rust/10 text-rust'
                : 'text-muted hover:bg-bone hover:text-ink'
            )}
          >
            <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-rust' : 'text-muted')} />
            {label}
          </Link>
        )
      })}

      <div className="pt-3 mt-3 border-t border-paper_border">
        <a
          href="/docs"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted hover:bg-bone hover:text-ink transition-all"
        >
          <BookOpen className="h-4 w-4 shrink-0 text-muted" />
          Dokumentace
        </a>
      </div>
    </nav>
  )
}

function SidebarLogo() {
  return (
    <div className="px-5 py-5 border-b border-paper_border">
      <Logo linkTo="/" className="hover:opacity-70 transition-opacity" />
    </div>
  )
}

function UserSection() {
  const { user } = useUser()
  const { openUserProfile } = useClerk()
  return (
    <div className="border-t border-paper_border p-3">
      <button
        type="button"
        onClick={() => openUserProfile()}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-bone transition-colors text-left group"
      >
        {/* Profilovka — neklikatelná samostatně, celý řádek je button */}
        <div className="shrink-0 pointer-events-none">
          <UserButton appearance={clerkAppearance} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink truncate leading-tight">
            {user?.firstName
              ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
              : user?.emailAddresses[0]?.emailAddress ?? 'Účet'}
          </p>
          <p className="text-xs text-muted truncate mt-0.5">
            {user?.emailAddresses[0]?.emailAddress ?? 'Nastavení účtu'}
          </p>
        </div>
        <svg className="h-3.5 w-3.5 text-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col h-screen bg-white border-r border-paper_border sticky top-0 shadow-sm">
        <SidebarLogo />
        <NavLinks />
        <UserSection />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-paper_border shadow-sm flex items-center justify-between px-4">
        <Logo linkTo="/" />
        <button
          onClick={() => setOpen(true)}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-muted hover:text-ink hover:bg-bone transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-[80vw] max-w-[15rem] bg-white flex flex-col h-full border-r border-paper_border shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-paper_border">
              <Logo linkTo="/" />
              <button onClick={() => setOpen(false)} className="text-muted hover:text-ink transition-colors rounded-lg p-1 hover:bg-bone">
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
