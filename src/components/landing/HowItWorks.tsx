export function HowItWorks() {
  return (
    <section className="border-t border-paper_border py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <h2
          className="font-mono font-medium text-ink mb-16"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Jak to funguje
        </h2>

        {/* Mockup s popisky */}
        <div className="relative">
          {/* Dashboard placeholder */}
          <div
            className="bg-paper border border-paper_border aspect-[16/10] flex items-center justify-center mx-auto max-w-3xl"
            style={{ borderRadius: '2px' }}
          >
            <span className="text-muted font-mono text-sm">[Dashboard screenshot]</span>
          </div>

          {/* Popisky — grid pod screenshotem na mobile, absolut na desktopu */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            {[
              { n: '01', label: 'Drag & drop PDF', pos: 'levý horní' },
              { n: '02', label: 'Vyber model (Fast/Balanced/Premium)', pos: 'pravý horní' },
              { n: '03', label: 'Nastav personality', pos: 'levý dolní' },
              { n: '04', label: 'Kopíruj script tag', pos: 'pravý dolní' },
            ].map(({ n, label }) => (
              <div key={n} className="flex gap-3 items-start">
                <span className="font-mono text-[10px] text-rust uppercase tracking-wider pt-0.5 shrink-0">{n}</span>
                <span className="font-mono text-[11px] text-ink uppercase tracking-wider leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
