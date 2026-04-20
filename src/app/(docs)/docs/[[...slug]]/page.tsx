import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug?: string[] }>
}

// Static doc content — no external dependencies
const DOCS: Record<string, { title: string; description: string; body: string }> = {
  '': {
    title: 'Úvod',
    description: 'Dokumentace BotCraft — AI chatbot builder s RAG podporou',
    body: `
BotCraft ti umožní vytvořit vlastního AI chatbota, natrénovat ho na tvých dokumentech a vložit ho na web za pár minut.

## Co tady najdeš

- **Quickstart** — postav prvního chatbota za 5 minut
- **Chatboti** — vytvoření, konfigurace, system prompt, modely
- **Dokumenty** — jaké soubory nahrát, jak funguje RAG
- **Integrace** — embed script tag na web

## Jak to funguje

1. Vytvoříš chatbota a napíšeš system prompt
2. Nahraješ dokumenty (PDF, TXT, DOCX, Markdown)
3. BotCraft je rozdělí na chunky a vytvoří embeddingy
4. Při každém chatu se najdou nejrelevantnější chunky a vloží do kontextu
5. Vložíš script tag na svůj web — hotovo
    `,
  },
  'quickstart': {
    title: 'Quickstart',
    description: 'Postav si prvního chatbota za 5 minut',
    body: `
## 1. Vytvoř účet

Registruj se na BotCraft — stačí Google nebo email.

## 2. Nový chatbot

V dashboardu klikni na **Nový chatbot**. Zadej:
- **Název** — interní název, nevidí ho uživatelé
- **System prompt** — instrukce pro AI (kdo je, co smí, jak odpovídá)

## 3. Nahraj dokument

Přejdi na kartu **Dokumenty** v nastavení chatbota. Nahraj PDF, TXT, DOCX nebo Markdown soubor (max 10 MB).

BotCraft soubor automaticky zpracuje — rozdělí na chunky, vytvoří embeddingy, uloží do knowledge base.

## 4. Otestuj v preview

V nastavení chatbota klikni na **Preview** — chatuj přímo v dashboardu.

## 5. Embed na web

Zkopíruj script tag z karty **Embed** a vlož ho do \`<head>\` nebo těsně před \`</body>\` tvého webu:

\`\`\`html
<script
  src="https://botcraft.app/widget.js"
  data-bot-id="tvuj-bot-id"
  async
></script>
\`\`\`

Chatbot widget se automaticky zobrazí v pravém dolním rohu.
    `,
  },
  'chatbots/create': {
    title: 'Vytvoření chatbota',
    description: 'Jak vytvořit a nakonfigurovat nového chatbota',
    body: `
## Nový chatbot

1. V dashboardu přejdi na **Chatboti**
2. Klikni na **Nový chatbot**
3. Vyplň název a system prompt
4. Ulož

## Konfigurace

Po vytvoření můžeš upravit:

- **Název** — interní název
- **System prompt** — hlavní instrukce pro AI
- **Model** — Fast / Balanced / Premium
- **Barva widgetu** — hex kód, propisuje se do embed tlačítka

## Smazání

V nastavení chatbota → sekce Danger zone → **Smazat chatbota**. Akce je nevratná a smaže i všechny dokumenty a konverzace.
    `,
  },
  'chatbots/system-prompt': {
    title: 'System prompt',
    description: 'Jak napsat dobrý system prompt pro chatbota',
    body: `
System prompt je instrukce, která definuje charakter a chování bota. Je to nejdůležitější věc pro kvalitu odpovědí.

## Struktura dobrého promptu

\`\`\`
Jsi [jméno], zákaznický asistent pro [firma].

Odpovídáš pouze na otázky týkající se [téma].
Na ostatní otázky slušně odmítneš.

Tón: [přátelský / formální / technický]
Jazyk: [čeština / angličtina]

Pokud nevíš odpověď, řekni to upřímně a navrhni kontakt na podporu.
\`\`\`

## Co do promptu patří

- Kdo bot je (jméno, role)
- Co smí a nesmí odpovídat
- Tón komunikace
- Jazyk odpovědí
- Co dělat když nezná odpověď

## Tipy

- Buď konkrétní — vague instrukce = vague výsledky
- Testuj v preview před nasazením
- Prompt lze kdykoliv upravit bez restartu
    `,
  },
  'chatbots/models': {
    title: 'Volba modelu',
    description: 'Fast, Balanced nebo Premium — kdy použít který model',
    body: `
BotCraft nabízí tři úrovně AI modelů:

## Fast — Llama 3.1 8B

- Nejrychlejší odpovědi (~0.5s)
- Dostupný na všech plánech
- Ideální pro jednoduché FAQ a zákaznické chaty
- Nižší náklady

## Balanced — Llama 3.3 70B

- Dobrý poměr rychlost/kvalita
- Pro střední složitost dotazů
- Dostupný od Pro plánu

## Premium — DeepSeek R1 70B

- Nejkvalitnější odpovědi
- Reasoning model — lepší na složité dotazy
- Dostupný od Pro plánu
- Pomalejší (~2–5s)

## Jak vybrat

| Použití | Doporučený model |
|---------|-----------------|
| Zákaznická podpora, FAQ | Fast |
| Produktová dokumentace | Balanced |
| Technická podpora, kód | Premium |
    `,
  },
  'documents/formats': {
    title: 'Podporované formáty',
    description: 'Jaké soubory lze nahrát do knowledge base',
    body: `
BotCraft umí zpracovat tyto typy souborů:

| Formát | Přípona | Poznámka |
|--------|---------|----------|
| PDF | .pdf | Text extrahován přes pdf-parse |
| Plain text | .txt | UTF-8 encoding |
| Markdown | .md | Zpracován jako plain text |
| Word dokument | .docx | Text extrahován přes mammoth |

## Limity

- Max velikost souboru: **10 MB**
- Maximální počet dokumentů závisí na plánu
- Maximální počet chunků závisí na plánu

## Jak probíhá zpracování

1. Soubor se nahraje a text se extrahuje
2. Text se rozdělí na chunky (~2000 znaků s překryvem)
3. Každý chunk se embeduje přes OpenAI text-embedding-3-small
4. Embeddingy se uloží do Supabase (pgvector)
5. Při chatu se vektorově vyhledají nejrelevantnější chunky

## Tipy pro lepší výsledky

- Strukturovaný text funguje lépe než neformátované bloky
- Kratší, zaměřené dokumenty > jeden velký dokument
- Odstraň nepotřebné záhlaví, zápatí, stránkování před nahráním
    `,
  },
  'embed/script-tag': {
    title: 'Embed — Script tag',
    description: 'Jak vložit chatbot widget na web pomocí script tagu',
    body: `
## Základní integrace

Zkopíruj script tag z karty **Embed** v nastavení chatbota a vlož ho do HTML svého webu:

\`\`\`html
<script
  src="https://botcraft.app/widget.js"
  data-bot-id="TVŮJ_BOT_ID"
  async
></script>
\`\`\`

Umísti ho těsně před \`</body>\` nebo do \`<head>\`.

## Kde najít Bot ID

V dashboardu → Chatboti → Vybrat chatbota → Embed → pole **Bot ID**.

## Jak widget vypadá

- Plovoucí tlačítko v pravém dolním rohu
- Barva tlačítka odpovídá nastavení v konfiguraci chatbota
- Po kliknutí se otevře chat okno (iframe)

## Next.js

\`\`\`tsx
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://botcraft.app/widget.js"
          data-bot-id="TVŮJ_BOT_ID"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
\`\`\`

## Omezení

- Widget funguje pouze pokud je chatbot aktivní
- Na Free plánu je limit zpráv/měsíc — po vyčerpání widget zobrazí upozornění
    `,
  },
}

function renderBody(body: string) {
  // Simple markdown-to-HTML for headers, code blocks, tables, bold, lists
  const lines = body.trim().split('\n')
  const html: string[] = []
  let inCode = false
  let codeLines: string[] = []
  let inTable = false
  let tableRows: string[][] = []

  function flushTable() {
    if (!tableRows.length) return
    const [header, , ...rows] = tableRows
    html.push('<div class="overflow-x-auto my-6"><table class="w-full text-sm border-collapse">')
    html.push('<thead><tr>')
    header.forEach(h => html.push(`<th class="text-left px-3 py-2 bg-[#F2F2EF] border border-[#e5e5e0] font-medium text-[#0A0A0A]">${h.trim()}</th>`))
    html.push('</tr></thead><tbody>')
    rows.forEach(row => {
      html.push('<tr>')
      row.forEach(cell => html.push(`<td class="px-3 py-2 border border-[#e5e5e0] text-[#6B6B6B]">${cell.trim()}</td>`))
      html.push('</tr>')
    })
    html.push('</tbody></table></div>')
    tableRows = []
    inTable = false
  }

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        html.push(`<pre class="bg-[#141414] text-[#e5e5e0] rounded-lg p-4 overflow-x-auto text-xs font-mono my-4"><code>${codeLines.join('\n')}</code></pre>`)
        codeLines = []
        inCode = false
      } else {
        if (inTable) flushTable()
        inCode = true
      }
      continue
    }
    if (inCode) { codeLines.push(line.replace(/</g, '&lt;').replace(/>/g, '&gt;')); continue }

    if (line.startsWith('|')) {
      inTable = true
      tableRows.push(line.split('|').filter((_, i, a) => i > 0 && i < a.length - 1))
      continue
    }
    if (inTable) flushTable()

    const t = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code class="bg-[#F2F2EF] px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')

    if (line.startsWith('## ')) html.push(`<h2 class="text-xl font-semibold text-[#0A0A0A] mt-10 mb-4 tracking-tight">${t.slice(3)}</h2>`)
    else if (line.startsWith('# ')) html.push(`<h1 class="text-3xl font-bold text-[#0A0A0A] mb-2 tracking-tight">${t.slice(2)}</h1>`)
    else if (line.startsWith('- ')) html.push(`<li class="text-[#6B6B6B] mb-1 ml-4 list-disc">${t.slice(2)}</li>`)
    else if (/^\d+\. /.test(line)) html.push(`<li class="text-[#6B6B6B] mb-1 ml-4 list-decimal">${t.replace(/^\d+\. /, '')}</li>`)
    else if (line.trim() === '') html.push('<div class="h-2"></div>')
    else html.push(`<p class="text-[#6B6B6B] leading-7 mb-0">${t}</p>`)
  }
  if (inTable) flushTable()

  return html.join('\n')
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const key = (slug ?? []).join('/')
  const doc = DOCS[key]
  if (!doc) notFound()

  return (
    <article>
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: renderBody(`# ${doc.title}\n\n${doc.body}`) }}
      />
    </article>
  )
}

export function generateStaticParams() {
  return Object.keys(DOCS).map(key => ({
    slug: key === '' ? [] : key.split('/'),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const key = (slug ?? []).join('/')
  const doc = DOCS[key]
  if (!doc) notFound()
  return {
    title: `${doc.title} — BotCraft Docs`,
    description: doc.description,
  }
}
