import { InteractiveBuilder } from './InteractiveBuilder'
import { HeroCTA } from './HeroCTA'
import { Zap } from 'lucide-react'

export function Hero() {
  return (
    <section className="max-w-[1240px] mx-auto px-5 md:px-8 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="grid md:grid-cols-[2fr_3fr] gap-12 md:gap-16 items-center">

        {/* Levý sloupec */}
        <div className="animate-fade-up">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-rust/10 text-rust text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Zap className="h-3.5 w-3.5" />
            AI Chatbot Builder
          </div>

          {/* H1 */}
          <h1
            className="font-mono font-medium text-ink leading-[1.08] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', letterSpacing: '-0.025em' }}
          >
            Chatbot který zná{' '}
            <span className="text-rust">tvůj byznys</span>{' '}
            — za tři minuty
          </h1>

          {/* Podtitulek */}
          <p className="text-muted text-base leading-relaxed mb-8 max-w-sm">
            Nahraj dokumenty, bot začne odpovídat z tvé knowledge base. Jeden řádek kódu pro embed kamkoliv.
          </p>

          {/* CTA — client island pro auth state */}
          <HeroCTA />
        </div>

        {/* Pravý sloupec */}
        <div className="animate-fade-up-2">
          <InteractiveBuilder />
        </div>
      </div>
    </section>
  )
}
