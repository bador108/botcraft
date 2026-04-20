import Link from 'next/link'
import type { ReactNode } from 'react'

const NAV = [
  { href: '/docs', label: 'Úvod' },
  { href: '/docs/quickstart', label: 'Quickstart' },
  { href: '/docs/chatbots/create', label: 'Vytvoření chatbota' },
  { href: '/docs/chatbots/system-prompt', label: 'System prompt' },
  { href: '/docs/chatbots/models', label: 'Volba modelu' },
  { href: '/docs/documents/formats', label: 'Podporované formáty' },
  { href: '/docs/embed/script-tag', label: 'Embed — Script tag' },
]

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-black/8 bg-white px-4 py-8 hidden md:block">
        <Link href="/" className="font-semibold text-sm text-[#0A0A0A] mb-6 block">
          ← BotCraft
        </Link>
        <p className="font-mono text-[10px] text-[#A8A8A8] uppercase tracking-widest mb-3">Dokumentace</p>
        <nav className="space-y-0.5">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-1.5 rounded-md text-sm text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F2EF] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        {children}
      </main>
    </div>
  )
}
