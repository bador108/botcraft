'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { InteractiveBuilder } from './InteractiveBuilder'
import { Zap } from 'lucide-react'

export function Hero() {
  const { isSignedIn } = useAuth()

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

          {/* CTA row */}
          <div className="flex items-center gap-4 flex-wrap mb-5">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-rust text-bone px-6 py-3 font-medium text-sm rounded-lg hover:bg-rust_hover transition-colors shadow-sm"
              >
                Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 bg-rust text-bone px-6 py-3 font-medium text-sm rounded-lg hover:bg-rust_hover transition-colors shadow-sm"
                >
                  Začít zdarma →
                </Link>
                <a
                  href="#video"
                  className="text-sm text-muted hover:text-ink transition-colors"
                >
                  Živá ukázka ↓
                </a>
              </>
            )}
          </div>

          {/* Trust line */}
          {!isSignedIn && (
            <p className="text-xs text-muted">
              50 zpráv zdarma · Bez platební karty · Setup za 3 minuty
            </p>
          )}
        </div>

        {/* Pravý sloupec */}
        <div className="animate-fade-up-2">
          <InteractiveBuilder />
        </div>
      </div>
    </section>
  )
}
