import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = { title: 'GDPR — BotCraft' }

export default function GDPRPage() {
  return (
    <div className="min-h-screen bg-bone">
      <nav className="border-b border-paper_border px-5 md:px-8 h-14 flex items-center">
        <Logo linkTo="/" />
      </nav>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-4">Právní</p>
        <h1 className="text-4xl font-bold text-ink tracking-tight mb-3">GDPR</h1>
        <p className="text-sm text-muted mb-12">Naposledy aktualizováno: duben 2026</p>
        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <div className="bg-white rounded-xl border border-paper_border p-6">
            <h2 className="font-semibold text-ink mb-2">Správce dat</h2>
            <p>Správcem osobních údajů je provozovatel BotCraft. Kontakt: <a href="mailto:hello@botcraft.app" className="text-rust hover:text-rust_hover">hello@botcraft.app</a>.</p>
          </div>
          <div className="bg-white rounded-xl border border-paper_border p-6">
            <h2 className="font-semibold text-ink mb-2">Zpracovávané údaje</h2>
            <p>Email, jméno (z Clerk auth), obsah konverzací vašich chatbotů, dokumenty nahrané do knowledge base.</p>
          </div>
          <div className="bg-white rounded-xl border border-paper_border p-6">
            <h2 className="font-semibold text-ink mb-2">Kde data ukládáme</h2>
            <p>Supabase (Frankfurt, EU) — databáze a vektory. Clerk (EU region) — autentizace. Groq — AI inference, data nejsou ukládána.</p>
          </div>
          <div className="bg-white rounded-xl border border-paper_border p-6">
            <h2 className="font-semibold text-ink mb-2">Vaše práva</h2>
            <p>Máte právo na přístup, opravu, výmaz a přenositelnost dat. Žádosti zasílejte na hello@botcraft.app.</p>
          </div>
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    </div>
  )
}
