import Link from 'next/link'
import { InteractiveBuilder } from './InteractiveBuilder'

export function Hero() {
  return (
    <section className="max-w-[1240px] mx-auto px-5 md:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="grid md:grid-cols-[2fr_3fr] gap-12 md:gap-16 items-center">

        {/* Levý sloupec — 40% */}
        <div className="animate-fade-up">
          {/* Eyebrow */}
          <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-6">
            AI Chatbot Builder
          </p>

          {/* H1 */}
          <h1 className="font-mono font-medium text-ink leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}>
            Nahraj PDF.<br />
            Dostaneš skript.<br />
            <span className="text-muted">Tvoje stránka má chatbota</span>
          </h1>

          {/* Podtitulek */}
          <p className="text-muted text-base leading-relaxed mb-8 max-w-sm">
            Postaveno na Groq LPU — odpovědi do 1 vteřiny. Žádné kódování. Žádné skryté poplatky.
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-4 flex-wrap mb-5">
            <Link
              href="/sign-up"
              className="inline-block bg-rust text-bone px-6 py-2.5 font-mono text-sm font-medium hover:bg-rust_hover transition-colors"
              style={{ borderRadius: '2px' }}
            >
              Začít zdarma →
            </Link>
            <a
              href="#video"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Živá ukázka ↓
            </a>
          </div>

          {/* Trust line */}
          <p className="text-[12px] text-muted font-mono">
            50 zpráv zdarma · Bez platební karty · Setup za 3 minuty
          </p>
        </div>

        {/* Pravý sloupec — 60% */}
        <div className="animate-fade-up-2">
          <InteractiveBuilder />
        </div>
      </div>
    </section>
  )
}
