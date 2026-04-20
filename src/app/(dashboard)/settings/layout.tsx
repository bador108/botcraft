'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/settings', label: 'Profil' },
  { href: '/settings/security', label: 'Bezpečnost' },
  { href: '/settings/notifications', label: 'Notifikace' },
  { href: '/settings/data', label: 'Data & Export', badge: 'brzy' },
  { href: '/settings/danger', label: 'Nebezpečná zóna' },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Nastavení</h1>
        <p className="text-sm text-muted mt-0.5">Účet, bezpečnost a preference</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar tabs */}
        <nav className="md:w-48 shrink-0">
          <ul className="space-y-0.5">
            {TABS.map(tab => {
              const isActive = tab.href === '/settings'
                ? pathname === '/settings'
                : pathname.startsWith(tab.href)

              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-white border border-paper_border text-ink font-medium shadow-sm'
                        : 'text-muted hover:text-ink hover:bg-bone'
                    )}
                  >
                    {tab.label}
                    {tab.badge && (
                      <span className="text-[10px] font-mono text-muted bg-paper px-1.5 py-0.5 rounded">
                        {tab.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
