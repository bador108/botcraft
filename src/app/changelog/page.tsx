import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = { title: 'Changelog — BotCraft' }

const entries = [
  {
    version: '1.0.0',
    date: 'Duben 2026',
    changes: [
      'Spuštění BotCraft',
      'RAG knowledge base s pgvector',
      'Fast, Balanced a Premium AI modely',
      'Embed widget — jeden řádek kódu',
      'Plány Hobby, Maker, Studio',
      'Custom branding bez badge',
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-bone">
      <nav className="border-b border-paper_border px-5 md:px-8 h-14 flex items-center">
        <Logo linkTo="/" />
      </nav>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-4">Produkt</p>
        <h1 className="text-4xl font-bold text-ink tracking-tight mb-3">Changelog</h1>
        <p className="text-base text-muted mb-12">Co je nového v BotCraft.</p>
        <div className="space-y-10">
          {entries.map(entry => (
            <div key={entry.version} className="flex gap-8">
              <div className="w-28 shrink-0">
                <p className="font-mono text-xs font-semibold text-ink">{entry.version}</p>
                <p className="font-mono text-[11px] text-muted mt-0.5">{entry.date}</p>
              </div>
              <div className="flex-1 border-l border-paper_border pl-8 pb-8">
                <ul className="space-y-2">
                  {entry.changes.map(c => (
                    <li key={c} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-rust mt-1 shrink-0">·</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    </div>
  )
}
