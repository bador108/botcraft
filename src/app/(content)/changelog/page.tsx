import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog — BotCraft',
  description: 'Co se v BotCraftu změnilo. Nejnovější nahoře.',
}

type ChangeType = 'new' | 'improved' | 'fixed'

const entries: {
  version: string
  date: string
  changes: Partial<Record<ChangeType, string[]>>
}[] = [
  {
    version: 'v0.4.0',
    date: '18. dubna 2026',
    changes: {
      new: [
        'Přepracovaný dashboard s přehledem usage v reálném čase',
        'Tři modelové úrovně: Fast, Balanced, Premium — přepínání přímo v nastavení bota',
        'A/B testování system promptů (Studio plán)',
        'Webhooky pro Slack a Discord (Studio plán)',
      ],
      improved: [
        'Odpovědi jsou o ~40 % rychlejší díky optimalizaci RAG pipeline',
        'Embed skript zmenšen z 24 KB na 8 KB',
        'Český překlad všech chybových hlášek ve widgetu',
      ],
      fixed: [
        'Bug, kvůli kterému se při uploadu PDF nad 15 MB občas nezobrazil progress bar',
        'Nesprávné formátování českých uvozovek v odpovědích bota',
      ],
    },
  },
  {
    version: 'v0.3.2',
    date: '2. dubna 2026',
    changes: {
      fixed: [
        'Rate limiting se v některých případech nereflektoval okamžitě po upgradu plánu',
        'Timezone bug v měsíčním resetu limitů (nově UTC+1 pro všechny CZ účty)',
      ],
    },
  },
  {
    version: 'v0.3.0',
    date: '20. března 2026',
    changes: {
      new: [
        'Custom doména pro widget (chat.tvojedomena.cz) — Studio plán',
        'Export konverzací do CSV s filtry podle data a chatbota',
        'White-label režim — možnost skrýt „Powered by BotCraft" pro Studio+',
      ],
      improved: [
        'Dashboard sidebar nově obsahuje sekce Dokumenty a Analytika',
        'Upload dokumentů podporuje .docx (kromě PDF, TXT, MD)',
      ],
    },
  },
  {
    version: 'v0.2.0',
    date: '28. února 2026',
    changes: {
      new: [
        'Maker plán (490 Kč/měs) — 5 chatbotů, 4 000 zpráv, plné RAG',
        'Studio plán (1 290 Kč/měs) — neomezení chatboti, custom doména, webhooky',
        'Měsíční fakturace přes Stripe',
      ],
      improved: ['Widget nově podporuje dark mode na základě preferencí návštěvníka'],
    },
  },
  {
    version: 'v0.1.0',
    date: '15. ledna 2026',
    changes: {
      new: [
        '3 modelové úrovně',
        'Upload PDF / TXT / Markdown dokumentů',
        'RAG knowledge base',
        'One-line embed přes <script> tag',
        'Hobby plán zdarma (50 zpráv/měs, 1 chatbot)',
      ],
    },
  },
]

const typeConfig: Record<ChangeType, { label: string; color: string }> = {
  new:      { label: 'Nové',      color: 'text-emerald-400' },
  improved: { label: 'Vylepšeno', color: 'text-indigo-400'  },
  fixed:    { label: 'Opraveno',  color: 'text-amber-400'   },
}

export default function ChangelogPage() {
  return (
    <div>
      <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3">Changelog</p>
      <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-3">Co je nového</h1>
      <p className="text-zinc-500 text-sm mb-14">Nejnovější změny nahoře.</p>

      <div>
        {entries.map((entry, i) => (
          <div
            key={entry.version}
            className={`grid md:grid-cols-[140px_1fr] gap-4 md:gap-10 py-10 ${
              i !== entries.length - 1 ? 'border-b border-white/[0.06]' : ''
            }`}
          >
            <div className="md:pt-0.5">
              <p className="font-mono text-sm font-medium text-white">{entry.version}</p>
              <p className="text-xs text-zinc-600 mt-1">{entry.date}</p>
            </div>

            <div className="space-y-5">
              {(Object.entries(entry.changes) as [ChangeType, string[]][]).map(([type, items]) => (
                <div key={type}>
                  <p className={`text-[10px] font-mono uppercase tracking-widest mb-2.5 ${typeConfig[type].color}`}>
                    {typeConfig[type].label}
                  </p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                        <span className="mt-2 h-1 w-1 rounded-full bg-zinc-700 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
