'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, Bot, CreditCard, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chatbots',  label: 'Chatbots',  icon: Bot },
  { href: '/billing',   label: 'Billing',   icon: CreditCard },
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
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              active
                ? 'bg-white/[0.06] text-white font-medium'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] font-normal'
            )}
          >
            <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-white' : 'text-zinc-600')} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-5 h-14 border-b border-white/[0.06]">
      <Image src="/icon.svg" alt="BotCraft" width={22} height={22} className="rounded-md" />
      <span className="font-semibold text-white text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>BotCraft</span>
    </div>
  )
}

function UserSection() {
  return (
    <div className="px-4 py-4 border-t border-white/[0.06]">
      <div className="flex items-center gap-2.5">
        <UserButton />
        <span className="text-xs text-zinc-600 truncate">Account</span>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <aside className="w-52 shrink-0 hidden md:flex flex-col h-screen bg-[#0C0C10] border-r border-white/[0.06] sticky top-0">
        <Logo />
        <NavLinks />
        <UserSection />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#0C0C10] border-b border-white/[0.06] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="BotCraft" width={22} height={22} className="rounded-md" />
          <span className="font-semibold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>BotCraft</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-[#0C0C10] flex flex-col h-full shadow-2xl border-r border-white/[0.06]">
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Image src="/icon.svg" alt="BotCraft" width={22} height={22} className="rounded-md" />
                <span className="font-semibold text-white text-sm" style={{ fontFamily: 'var(--font-display)' }}>BotCraft</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
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
