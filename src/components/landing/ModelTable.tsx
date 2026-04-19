const models = [
  {
    icon: '🏃',
    name: 'Fast',
    groq: 'llama-3.1-8b-instant',
    speed: '~1000 tok/s',
    context: '128k',
    usage: 'FAQ, jednoduché dotazy',
  },
  {
    icon: '⚖️',
    name: 'Balanced',
    groq: 'llama-3.3-70b-versatile',
    speed: '~500 tok/s',
    context: '131k',
    usage: 'Komplexní RAG, reasoning',
  },
  {
    icon: '🎯',
    name: 'Premium',
    groq: 'deepseek-r1-distill-llama-70b',
    speed: '~200 tok/s',
    context: '262k',
    usage: 'Dlouhé dokumenty, nejvyšší kvalita',
  },
]

export function ModelTable() {
  return (
    <section className="border-t border-paper_border py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <h2
          className="font-mono font-medium text-ink mb-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Tři modely. Žádný marketing
        </h2>
        <p className="text-muted text-sm mb-10">
          Powered by Groq LPU. Žádný token billing navrch — limit zpráv je limit zpráv.
        </p>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-paper_border">
                <th className="font-mono text-[11px] uppercase tracking-wider text-muted pb-3 pr-8">Model</th>
                <th className="font-mono text-[11px] uppercase tracking-wider text-muted pb-3 pr-8">Rychlost</th>
                <th className="font-mono text-[11px] uppercase tracking-wider text-muted pb-3 pr-8">Kontext</th>
                <th className="font-mono text-[11px] uppercase tracking-wider text-muted pb-3">Použití</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper_border">
              {models.map(m => (
                <tr key={m.name}>
                  <td className="py-4 pr-8">
                    <span className="mr-2">{m.icon}</span>
                    <span className="font-mono text-sm font-medium text-ink">{m.name}</span>
                    <span className="ml-2 text-[11px] text-muted font-mono">({m.groq})</span>
                  </td>
                  <td className="py-4 pr-8 font-mono text-sm text-ink">{m.speed}</td>
                  <td className="py-4 pr-8 font-mono text-sm text-ink">{m.context}</td>
                  <td className="py-4 text-sm text-muted">{m.usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
