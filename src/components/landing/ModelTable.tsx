const models = [
  {
    icon: '🏃',
    name: 'Fast',
    speed: '~1 vteřina',
    context: '128k znaků',
    usage: 'FAQ, jednoduché dotazy',
  },
  {
    icon: '⚖️',
    name: 'Balanced',
    speed: '~1–2 vteřiny',
    context: '131k znaků',
    usage: 'Komplexní RAG, reasoning',
  },
  {
    icon: '🎯',
    name: 'Premium',
    speed: '~2–3 vteřiny',
    context: '262k znaků',
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
          Všechny tři modely běží v reálném čase. Žádný token billing navrch — limit zpráv je limit zpráv.
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
