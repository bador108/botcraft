import Link from 'next/link'

export function FinalCTA() {
  return (
    <section className="border-t border-paper_border py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 text-center">
        <h2
          className="font-mono font-medium text-ink mb-4"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em', lineHeight: 1.05 }}
        >
          Postav si prvního chatbota dneska
        </h2>
        <p className="text-muted text-base mb-8">
          50 zpráv zdarma · Žádná karta · Kdykoli zrušíš
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-rust text-bone px-8 py-3 font-medium text-base rounded-lg hover:bg-rust_hover transition-colors shadow-sm"
        >
          Začít zdarma →
        </Link>
      </div>
    </section>
  )
}
