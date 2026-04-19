import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = { title: 'O nás — BotCraft' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bone">
      <nav className="border-b border-paper_border px-5 md:px-8 h-14 flex items-center">
        <Logo linkTo="/" />
      </nav>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-4">Firma</p>
        <h1 className="text-4xl font-bold text-ink tracking-tight mb-6">O nás</h1>
        <div className="space-y-6 text-base text-muted leading-relaxed">
          <p>BotCraft je nástroj pro tvůrce, kteří chtějí přidat AI chatbota na svůj web bez měsíců vývoje.</p>
          <p>Věříme, že dobrý chatbot začíná dobrou knowledge base — ne složitým kódem. Proto jsme postavili RAG pipeline, který funguje od první minuty.</p>
          <p>Jsme malý tým. Stavíme produkt, který sami chceme používat.</p>
        </div>
        <div className="mt-10 pt-10 border-t border-paper_border">
          <p className="text-sm text-muted mb-4">Kontakt</p>
          <a href="mailto:hello@botcraft.app" className="text-rust hover:text-rust_hover font-medium transition-colors">hello@botcraft.app</a>
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    </div>
  )
}
