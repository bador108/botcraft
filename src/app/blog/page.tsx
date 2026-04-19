import Link from 'next/link'
import { Logo } from '@/components/Logo'

export const metadata = { title: 'Blog — BotCraft' }

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-bone">
      <nav className="border-b border-paper_border px-5 md:px-8 h-14 flex items-center">
        <Logo linkTo="/" />
      </nav>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-4">Firma</p>
        <h1 className="text-4xl font-bold text-ink tracking-tight mb-3">Blog</h1>
        <p className="text-base text-muted mb-12">Novinky, tipy a příběhy ze zákulisí.</p>
        <div className="border border-paper_border border-dashed bg-paper rounded-xl p-12 text-center">
          <p className="font-semibold text-ink mb-1">Zatím žádné články</p>
          <p className="text-sm text-muted">Brzy přijdou první příspěvky.</p>
        </div>
        <div className="mt-10">
          <Link href="/" className="text-sm text-muted hover:text-ink transition-colors">← Zpět na hlavní stránku</Link>
        </div>
      </div>
    </div>
  )
}
