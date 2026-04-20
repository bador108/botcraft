import Link from 'next/link'
import type { ReactNode } from 'react'

const NAV = [
  { href: '/docs', label: 'Úvod' },
  { href: '/docs/quickstart', label: 'Quickstart' },
  { href: '/docs/chatbots/create', label: 'Vytvoření chatbota', section: 'Chatboti' },
  { href: '/docs/chatbots/system-prompt', label: 'System prompt' },
  { href: '/docs/chatbots/models', label: 'Volba modelu' },
  { href: '/docs/chatbots/branding', label: 'Branding' },
  { href: '/docs/documents/formats', label: 'Podporované formáty', section: 'Dokumenty' },
  { href: '/docs/documents/rag-guide', label: 'Jak funguje RAG' },
  { href: '/docs/documents/best-practices', label: 'Best practices' },
  { href: '/docs/embed/script-tag', label: 'Script tag', section: 'Integrace' },
  { href: '/docs/embed/customization', label: 'Customizace widgetu' },
  { href: '/docs/embed/javascript-api', label: 'JavaScript API' },
  { href: '/docs/analytics/overview', label: 'Metriky', section: 'Analytika' },
  { href: '/docs/api/authentication', label: 'Autentizace', section: 'REST API' },
  { href: '/docs/api/endpoints', label: 'Endpointy' },
  { href: '/docs/api/rate-limits', label: 'Rate limiting' },
  { href: '/docs/webhooks/overview', label: 'Přehled webhooků', section: 'Webhooky' },
  { href: '/docs/webhooks/events', label: 'Události' },
  { href: '/docs/webhooks/signatures', label: 'Ověření podpisu' },
  { href: '/docs/troubleshooting/bot-wrong-answers', label: 'Špatné odpovědi', section: 'Troubleshooting' },
  { href: '/docs/troubleshooting/widget-not-showing', label: 'Widget se nezobrazí' },
  { href: '/docs/troubleshooting/rate-limits', label: 'Rate limit chyby' },
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
            <div key={item.href}>
              {item.section && (
                <p className="font-mono text-[9px] text-[#A8A8A8] uppercase tracking-widest mt-4 mb-1 px-3">
                  {item.section}
                </p>
              )}
              <Link
                href={item.href}
                className="block px-3 py-1.5 rounded-md text-sm text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-[#F2F2EF] transition-colors"
              >
                {item.label}
              </Link>
            </div>
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
