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
    version: 'v0.5.0',
    date: '22. dubna 2026',
    changes: {
      new: [
        'Vlastní avatar chatbota — nahraj logo nebo favicon (PNG, JPG, SVG, ICO, max 512 KB)',
        '8 nových preset ikon pro bota (klasický robot, chip, bubble, hvězda, blesk...)',
        'Barva widgetu se načítá z API při každém načtení stránky — stačí změnit v dashboardu, projeví se okamžitě',
        'Skript pro embed je stabilní navždy — žádné přegenerování při změně nastavení',
      ],
      improved: [
        'Sidebar: celý řádek účtu je klikatelný, zobrazuje jméno a email',
        'Knowledge base: přepracovaný design — drag & drop, čistší typografie',
        'Widget button získá správnou barvu ihned při načtení stránky (dříve až po prvním otevření)',
        'Content stránky (blog, docs, changelog) přístupné bez přihlášení',
        'Loading skeletony ve všech dashboard sekcích — plynulejší UX při cold startu',
      ],
      fixed: [
        'Barva tlačítka widgetu byla natvrdo #6366f1 místo barvy bota',
        'Avatar v chat widgetu se neaktualizoval po nahrání vlastního obrázku',
        'Blog, docs a kontakt stránky vyžadovaly přihlášení',
      ],
    },
  },
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
  new:      { label: 'Nové',      color: 'text-[#059669]' },
  improved: { label: 'Vylepšeno', color: 'text-[#2563EB]' },
  fixed:    { label: 'Opraveno',  color: 'text-[#D4500A]' },
}

export default function ChangelogPage() {
  return (
    <div>
      <p className="text-xs text-[#A8A8A8] uppercase tracking-[0.15em] font-medium mb-3">Changelog</p>
      <h1 className="font-display text-4xl font-bold text-[#0A0A0A] tracking-tight mb-3">Co je nového</h1>
      <p className="text-[#6B6B6B] text-sm mb-14">Nejnovější změny nahoře.</p>

      <div>
        {entries.map((entry, i) => (
          <div
            key={entry.version}
            className={`grid md:grid-cols-[140px_1fr] gap-4 md:gap-10 py-10 ${
              i !== entries.length - 1 ? 'border-b border-black/[0.06]' : ''
            }`}
          >
            <div className="md:pt-0.5">
              <p className="font-mono text-sm font-semibold text-[#0A0A0A]">{entry.version}</p>
              <p className="text-xs text-[#A8A8A8] mt-1">{entry.date}</p>
            </div>

            <div className="space-y-5">
              {(Object.entries(entry.changes) as [ChangeType, string[]][]).map(([type, items]) => (
                <div key={type}>
                  <p className={`text-[10px] font-mono uppercase tracking-widest mb-2.5 ${typeConfig[type].color}`}>
                    {typeConfig[type].label}
                  </p>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#6B6B6B]">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/15 shrink-0" />
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
