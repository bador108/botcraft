import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = { title: 'Podmínky použití — BotCraft' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bone">
      <nav className="border-b border-paper_border px-5 md:px-8 h-14 flex items-center">
        <Logo linkTo="/" />
      </nav>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-4">Právní</p>
        <h1 className="text-4xl font-bold text-ink tracking-tight mb-3">Podmínky použití</h1>
        <p className="text-sm text-muted mb-12">Naposledy aktualizováno: duben 2026</p>
        <div className="border border-paper_border border-dashed bg-paper rounded-xl p-8 text-center">
          <p className="text-sm text-muted">Podmínky použití jsou připravovány. Kontaktuj nás na <a href="mailto:hello@botcraft.app" className="text-rust hover:text-rust_hover">hello@botcraft.app</a>.</p>
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    </div>
  )
}
