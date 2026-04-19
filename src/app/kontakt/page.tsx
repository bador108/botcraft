import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = { title: 'Kontakt — BotCraft' }

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bone">
      <nav className="border-b border-paper_border px-5 md:px-8 h-14 flex items-center">
        <Logo linkTo="/" />
      </nav>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-4">Firma</p>
        <h1 className="text-4xl font-bold text-ink tracking-tight mb-3">Kontakt</h1>
        <p className="text-base text-muted mb-12 leading-relaxed">Máš otázku, nápad nebo chceš reportovat bug? Ozvi se.</p>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-paper_border p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">Obecné dotazy</p>
              <p className="text-sm text-muted mt-0.5">Ceník, funkce, jak to funguje</p>
            </div>
            <a href="mailto:hello@botcraft.app" className="text-sm font-medium text-rust hover:text-rust_hover transition-colors">hello@botcraft.app</a>
          </div>
          <div className="bg-white rounded-xl border border-paper_border p-6 flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">Technická podpora</p>
              <p className="text-sm text-muted mt-0.5">Problémy, bugy, integrace</p>
            </div>
            <a href="mailto:support@botcraft.app" className="text-sm font-medium text-rust hover:text-rust_hover transition-colors">support@botcraft.app</a>
          </div>
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    </div>
  )
}
