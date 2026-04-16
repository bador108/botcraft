'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import { LayoutDashboard, Bot, CreditCard, Zap, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chatbots', label: 'Chatbots', icon: Bot },
  { href: '/billing', label: 'Billing', icon: CreditCard },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname()
  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {nav.map(({ href, label, icon: Icon }) => {
        const active = path === href || (href !== '/dashboard' && path.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function UserSection() {
  return (
    <div className="px-4 py-4 border-t border-gray-800">
      <div className="flex items-center gap-3">
        <UserButton />
        <span className="text-xs text-gray-400 truncate">Account</span>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-60 shrink-0 hidden md:flex flex-col h-screen bg-gray-900 border-r border-gray-800 sticky top-0">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-gray-800">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">BotCraft</span>
        </div>
        <NavLinks />
        <UserSection />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">BotCraft</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-10 w-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 active:bg-gray-700 transition"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-gray-900 flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-between px-5 h-14 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold text-white tracking-tight">BotCraft</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
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
