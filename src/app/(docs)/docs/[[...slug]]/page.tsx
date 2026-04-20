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

## Fast

- Nejrychlejší odpovědi (~0.5s)
- Dostupný na všech plánech
- Ideální pro jednoduché FAQ a zákaznické chaty
- Nižší náklady

## Balanced

- Dobrý poměr rychlost/kvalita
- Pro střední složitost dotazů
- Dostupný od Maker plánu

## Premium

- Nejkvalitnější odpovědi
- Reasoning model — lepší na složité dotazy
- Dostupný od Studio plánu
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
  'chatbots/branding': {
    title: 'Branding',
    description: 'Vlastní barva, welcome zpráva, avatar chatbota',
    body: `
## Barva widgetu

V nastavení chatbota → pole **Barva**. Zadej hex kód (např. \`#2563EB\`).
Barva se propisuje do chat bubble tlačítka na webu.

## Welcome zpráva

První zpráva, kterou uvidí uživatel po otevření chatu.
Doporučení: krátká, přátelská, s výzvou k akci.

\`\`\`
Ahoj! Jsem Marek, asistent Acme s.r.o.
Jak ti mohu pomoci?
\`\`\`

## Avatar

V současné verzi je avatar generovaný z initials chatbota.
Vlastní avatar (URL obrázku) je dostupný od plánu Maker.

## Pozice widgetu

Výchozí: pravý dolní roh. Změna pozice je dostupná přes JavaScript API nebo CSS override.

## Odstranění badge

Na Hobby plánu widget zobrazuje "Powered by BotCraft" badge.
Od plánu Maker je badge skrytý automaticky.
    `,
  },
  'documents/rag-guide': {
    title: 'Jak funguje RAG',
    description: 'Retrieval-Augmented Generation — princip a optimalizace',
    body: `
RAG (Retrieval-Augmented Generation) umožňuje chatbotu odpovídat na základě tvých dokumentů, ne jen trénovacích dat.

## Jak to funguje

1. **Indexace** — při nahrání dokumentu BotCraft rozdělí text na chunky (~2000 znaků) a vytvoří pro každý embedding (vektorová reprezentace)
2. **Vyhledávání** — při každé otázce uživatele BotCraft embeduje dotaz a vyhledá 5 nejpodobnějších chunků (cosine similarity)
3. **Generování** — relevantní chunky se vloží do kontextu pro AI model, který na jejich základě odpovídá

## Prahová hodnota podobnosti

BotCraft používá prahovou hodnotu **0.3** (z rozsahu 0–1).
Chunky s podobností pod 0.3 jsou ignorovány — bot označí odpověď jako "bez kontextu".

## Proč bot odpovídá špatně?

- Odpověď není v dokumentech → přidej dokument s danou informací
- Špatná formulace v dokumentu → přepiš text jasněji
- Chunk je příliš dlouhý s různými tématy → rozděl dokument
- Dotaz je příliš vágní → systém nenajde správný chunk

## Limity plánů

| Plán | RAG | Max chunks |
|------|-----|------------|
| Hobby | ✗ | 50 |
| Maker | ✓ | ∞ |
| Studio | ✓ | ∞ |
    `,
  },
  'documents/best-practices': {
    title: 'Best practices pro dokumenty',
    description: 'Jak strukturovat dokumenty pro nejlepší výsledky',
    body: `
## Princip: kratší a zaměřené > jeden velký soubor

Jeden dokument = jedno téma. AI najde relevantní informace lépe z 10 malých dokumentů než z jednoho 100stránkového PDF.

## Formátování

- Používej nadpisy (H1, H2) pro strukturu
- Kratší odstavce (2–4 věty) jsou lepší než bloky textu
- Bullet pointy jsou snadno indexovatelné
- Odstraň záhlaví, zápatí, čísla stránek před nahráním

## Jazyk

Dokumenty a dotazy by měly být ve **stejném jazyce**. Česský chatbot + české dokumenty = nejlepší výsledky.

## Co nedělat

- Nenahrávej naskenovaná PDF (jsou obrázky, text nelze extrahovat)
- Nenahrávej prezentace plné grafů bez textu
- Nepoužívej zkratky bez vysvětlení
- Nepřidávej stejnou informaci do více dokumentů (duplikát snižuje přesnost)

## Testování

Po nahrání dokumentu otestuj chatbota v preview:
1. Zeptej se na konkrétní fakt z dokumentu
2. Pokud bot neví → přidej informaci explicitněji
3. Opakuj dokud bot odpovídá správně
    `,
  },
  'embed/customization': {
    title: 'Customizace widgetu',
    description: 'Pozice, barvy, CSS override, spouštění widgetu',
    body: `
## Výchozí chování

Widget se zobrazí jako plovoucí tlačítko vpravo dole. Po kliknutí se otevře chat okno (iframe).

## Barva

Nastavuje se v dashboardu — propaguje se do tlačítka i hlavičky chatu.

## CSS Override

Widget je vložen jako iframe — nelze přímo stylovat přes CSS.
Pozici tlačítka lze upravit přes \`window.BotCraft\` API (viz JavaScript API).

## Automatické otevření

\`\`\`html
<script>
  window.addEventListener('botcraft:ready', function() {
    window.BotCraft.open()
  })
</script>
\`\`\`

## Otevření po X sekundách

\`\`\`javascript
setTimeout(function() {
  if (window.BotCraft) window.BotCraft.open()
}, 5000)
\`\`\`

## Skrytí tlačítka

\`\`\`javascript
if (window.BotCraft) window.BotCraft.hide()
\`\`\`
    `,
  },
  'embed/javascript-api': {
    title: 'JavaScript API',
    description: 'window.BotCraft API — programatické ovládání widgetu',
    body: `
## Dostupné metody

\`\`\`javascript
// Otevři chat okno
window.BotCraft.open()

// Zavři chat okno
window.BotCraft.close()

// Skryj celý widget (tlačítko i okno)
window.BotCraft.hide()

// Zobraz widget
window.BotCraft.show()

// Zkontroluj zda je widget načtený
if (window.BotCraft) { ... }
\`\`\`

## Event listenery

\`\`\`javascript
// Widget je připravený
window.addEventListener('botcraft:ready', function(e) {
  console.log('BotCraft ready', e.detail.botId)
})

// Uživatel otevřel chat
window.addEventListener('botcraft:open', function() {})

// Uživatel zavřel chat
window.addEventListener('botcraft:close', function() {})
\`\`\`

## Předvyplnění zprávy

\`\`\`javascript
window.BotCraft.open({ message: 'Mám otázku ohledně ceny' })
\`\`\`

## Dostupnost

JavaScript API je dostupné po načtení widget.js skriptu.
Vždy kontroluj \`if (window.BotCraft)\` před voláním.
    `,
  },
  'analytics/overview': {
    title: 'Analytika — přehled metrik',
    description: 'Co znamenají jednotlivé metriky a jak je číst',
    body: `
## Zprávy

Počet zpráv odeslaných uživateli chatbotů (nezahrnuje systémové zprávy).
Dobrý indikátor celkové aktivity.

## Unikátní uživatelé

Počet unikátních session ID. Každá session = jeden unikátní uživatel za jeden návštěvní "sezení".
Není to přesný count unikátních osob — jeden člověk může mít více sessions (jiný prohlížeč, incognito).

## Prům. odezva

Průměrná doba od odeslání dotazu do přijetí první odpovědi v milisekundách.

| Hodnota | Hodnocení |
|---------|-----------|
| < 500 ms | Výborné |
| 500–1500 ms | Dobré |
| > 1500 ms | Zpomalení (zkontroluj model) |

## Satisfaction rate

Poměr pozitivních hodnocení (👍) ku všem hodnocením (👍 + 👎).
Zobrazuje se pouze po 5+ hodnoceních.

## Nezodpovězené dotazy

Dotazy, na které bot nenašel relevantní chunk v knowledge base.
Indikuje chybějící obsah v dokumentech → přidej chybějící informace.

## Využití modelů

Rozložení chat zpráv podle AI modelu. Pomáhá optimalizovat plán — pokud převažuje Premium model a ty platíš za Maker, zvaž downgrade na Balanced.
    `,
  },
  'troubleshooting/bot-wrong-answers': {
    title: 'Bot odpovídá špatně',
    description: 'Jak diagnostikovat a opravit špatné odpovědi chatbota',
    body: `
## Diagnóza

**1. Zkontroluj knowledge base**

Otevři chatbota → záložka Dokumenty. Jsou tam relevantní informace k dotazu?

**2. Zkontroluj nezodpovězené dotazy**

Analytika → Nezodpovězené dotazy. Pokud je dotaz tam, bot neměl žádný relevantní chunk.

**3. Zkontroluj system prompt**

Je prompt dostatečně konkrétní? Nedává botovi příliš volnosti?

## Časté problémy

**Bot vymýšlí informace (hallucination)**
→ Přidej do system promptu: "Pokud nevíš odpověď z poskytnutého kontextu, řekni to upřímně."
→ Upgraduj na model s lepším reasoning

**Bot ignoruje dokumenty**
→ Zkontroluj zda jsou dokumenty nahrány a zpracovány (status = Zpracováno)
→ Zkontroluj zda jsou v dokumentu relevantní odpovědi

**Bot neodpovídá česky**
→ Přidej do system promptu: "Vždy odpovídej v češtině."

**Bot je příliš stručný / příliš ukecaný**
→ Uprav system prompt: "Odpovídej stručně, max 3 věty." nebo "Odpovídej detailně."

**Pomalé odpovědi**
→ Přepni na Fast model
→ Zkontroluj že dokumenty nejsou zbytečně velké

## Reset knowledge base

Smaž dokumenty → nahraj je znovu. Tím se přeindexují embeddingy.
    `,
  },
  'api/authentication': {
    title: 'API — Autentizace',
    description: 'Jak se autentizovat k BotCraft REST API pomocí API klíčů',
    body: `
BotCraft REST API používá Bearer token autentizaci. API klíče vytvoříš v **Nastavení → API klíče** (dostupné od plánu Studio).

## Vytvoření API klíče

1. Přejdi do **Nastavení → API klíče**
2. Klikni na **Vytvořit**
3. Zadej název a vyber scope (\`read\` nebo \`read + write\`)
4. Klíč se zobrazí **jedinkrát** — ulož ho do bezpečného místa

## Použití v requestech

Přidej hlavičku \`Authorization\` s prefixem \`Bearer\`:

\`\`\`bash
curl https://botcraft.app/api/v1/chatbots \\
  -H "Authorization: Bearer sk_bc_live_..."
\`\`\`

\`\`\`typescript
const res = await fetch('https://botcraft.app/api/v1/chatbots', {
  headers: {
    Authorization: \`Bearer \${process.env.BOTCRAFT_API_KEY}\`,
  },
})
const { chatbots } = await res.json()
\`\`\`

## Scopy

| Scope | Co povoluje |
|-------|-------------|
| \`read\` | GET requesty — čtení chatbotů, zpráv |
| \`write\` | PATCH requesty — úprava chatbotů |

## Formát klíče

Všechny klíče začínají prefixem \`sk_bc_live_\`. Nikdy nezveřejňuj klíč v client-side kódu.

## Revokace

Klíč kdykoli zrevokuješ v **Nastavení → API klíče** → ikona smazání. Revokace je okamžitá.
    `,
  },
  'api/endpoints': {
    title: 'API — Endpointy',
    description: 'Přehled všech dostupných REST API endpointů',
    body: `
Base URL: \`https://botcraft.app/api/v1\`

## Chatboti

### GET /chatbots

Vrátí seznam všech chatbotů autentizovaného uživatele.

\`\`\`bash
GET /api/v1/chatbots
Authorization: Bearer sk_bc_live_...
\`\`\`

**Response:**
\`\`\`json
{
  "chatbots": [
    {
      "id": "uuid",
      "name": "Můj chatbot",
      "model": "balanced",
      "is_active": true,
      "welcome_message": "Dobrý den!",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

### GET /chatbots/:id

Detail konkrétního chatbota.

\`\`\`bash
GET /api/v1/chatbots/uuid
Authorization: Bearer sk_bc_live_...
\`\`\`

### PATCH /chatbots/:id

Aktualizace chatbota (vyžaduje scope \`write\`).

\`\`\`bash
PATCH /api/v1/chatbots/uuid
Authorization: Bearer sk_bc_live_...
Content-Type: application/json

{
  "name": "Nový název",
  "is_active": false
}
\`\`\`

Povolené fieldy: \`name\`, \`system_prompt\`, \`welcome_message\`, \`is_active\`, \`model\`.

### GET /chatbots/:id/messages

Konverzace chatbota se stránkováním.

\`\`\`bash
GET /api/v1/chatbots/uuid/messages?limit=100&offset=0
Authorization: Bearer sk_bc_live_...
\`\`\`

**Query parametry:**

| Parametr | Default | Max |
|----------|---------|-----|
| \`limit\` | 100 | 1000 |
| \`offset\` | 0 | — |

**Response:**
\`\`\`json
{
  "messages": [...],
  "total": 1234,
  "limit": 100,
  "offset": 0
}
\`\`\`

## HTTP chybové kódy

| Kód | Popis |
|-----|-------|
| 401 | Chybí nebo neplatný API klíč |
| 403 | Nedostatečný scope |
| 404 | Zdroj neexistuje nebo nepatří tobě |
| 429 | Rate limit překročen |
| 500 | Interní chyba |
    `,
  },
  'api/rate-limits': {
    title: 'API — Rate limiting',
    description: 'Limity požadavků pro REST API',
    body: `
REST API má stejné rate limity jako chat endpointy — závisí na tvém plánu.

## Limity dle plánu

| Plán | Requesty / 60 s |
|------|-----------------|
| Studio | 100 |
| Enterprise | 500 |

## Hlavičky odpovědi

Každý response obsahuje hlavičky o aktuálním stavu limitu:

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1714560000
\`\`\`

## Překročení limitu

Při překročení API vrátí **HTTP 429** s tělem:

\`\`\`json
{ "error": "Rate limit exceeded" }
\`\`\`

## Doporučení

- Cachuj odpovědi lokálně kde to dává smysl
- Exponential backoff při 429
- Dávkuj requesty — jeden GET /chatbots místo N GET /chatbots/:id
    `,
  },
  'webhooks/overview': {
    title: 'Webhooky — Přehled',
    description: 'Jak fungují BotCraft webhooky pro real-time notifikace',
    body: `
Webhooky ti umožní reagovat na události v BotCraft v reálném čase — nová zpráva od uživatele, nahraný dokument, dosažení limitu.

Webhooky jsou dostupné od plánu **Studio**.

## Jak to funguje

1. V **Nastavení → Webhooky** vytvoříš endpoint s URL a výběrem událostí
2. BotCraft při každé události pošle HTTP POST na tvou URL
3. Tvůj server zpracuje payload a vrátí HTTP 2xx

## Payload struktura

\`\`\`json
{
  "event": "message.created",
  "data": {
    "chatbot_id": "uuid",
    "session_id": "uuid",
    "user_message": "Jak funguje vrácení zboží?",
    "assistant_message": "Zboží lze vrátit do 14 dní..."
  },
  "timestamp": "2026-04-20T10:30:00Z"
}
\`\`\`

## Spolehlivost

- Timeout požadavku: **10 sekund**
- Bez opakování — pokud server neodpoví, doručení se nezopakuje
- Po **10 po sobě jdoucích selháních** se webhook automaticky deaktivuje
- Historii posledních 50 doručení najdeš v nastavení → klikni **Doručení**

## Test

V nastavení webhooků klikni na tlačítko **Test** (►) — odešle testovací payload s první událostí.
    `,
  },
  'webhooks/events': {
    title: 'Webhooky — Události',
    description: 'Přehled všech webhookových událostí a jejich payloadů',
    body: `
## message.created

Nová zpráva uživatele a odpověď chatbota.

\`\`\`json
{
  "event": "message.created",
  "data": {
    "chatbot_id": "uuid",
    "session_id": "uuid",
    "user_message": "dotaz uživatele",
    "assistant_message": "odpověď chatbota"
  },
  "timestamp": "2026-04-20T10:30:00Z"
}
\`\`\`

## document.uploaded

Nový dokument byl nahrán a zpracován.

\`\`\`json
{
  "event": "document.uploaded",
  "data": {
    "document_id": "uuid",
    "name": "manual.pdf",
    "chatbot_id": "uuid",
    "chunks": 42
  },
  "timestamp": "2026-04-20T10:30:00Z"
}
\`\`\`

## chatbot.updated

Konfigurace chatbota byla změněna (přes API PATCH).

\`\`\`json
{
  "event": "chatbot.updated",
  "data": {
    "chatbot_id": "uuid",
    "changes": ["name", "system_prompt"]
  },
  "timestamp": "2026-04-20T10:30:00Z"
}
\`\`\`

## document.deleted

Dokument byl smazán.

\`\`\`json
{
  "event": "document.deleted",
  "data": {
    "document_id": "uuid",
    "chatbot_id": "uuid"
  },
  "timestamp": "2026-04-20T10:30:00Z"
}
\`\`\`

## limit.reached

Chatbot dosáhl měsíčního limitu zpráv.

\`\`\`json
{
  "event": "limit.reached",
  "data": {
    "user_id": "user_xxx",
    "plan": "maker",
    "limit": 4000
  },
  "timestamp": "2026-04-20T10:30:00Z"
}
\`\`\`
    `,
  },
  'webhooks/signatures': {
    title: 'Webhooky — Ověření podpisu',
    description: 'Jak ověřit, že webhook přišel od BotCraft',
    body: `
Každý webhook request obsahuje hlavičku \`X-BotCraft-Signature\` s HMAC-SHA256 podpisem těla requestu.

## Formát

\`\`\`
X-BotCraft-Signature: sha256=a1b2c3d4...
X-BotCraft-Event: message.created
\`\`\`

## Ověření (Node.js)

\`\`\`typescript
import crypto from 'crypto'

function verifyWebhook(rawBody: string, signature: string, secret: string): boolean {
  const expected = \`sha256=\${crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')}\`

  // Použij timingSafeEqual pro ochranu před timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  )
}

// Express.js příklad
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['x-botcraft-signature'] as string
  const valid = verifyWebhook(req.body.toString(), sig, process.env.WEBHOOK_SECRET!)

  if (!valid) return res.status(401).send('Invalid signature')

  const payload = JSON.parse(req.body.toString())
  // zpracuj událost...

  res.sendStatus(200)
})
\`\`\`

## Kde najdu secret?

Secret se zobrazí **jedinkrát** při vytvoření webhooku. Ulož ho jako env proměnnou.

Pokud secret ztratíš, smaž webhook a vytvoř nový.

## Důležité

- Vždy ověřuj podpis — bez ověření může kdokoli posílat falešné requesty
- Použij \`timingSafeEqual\` místo \`===\` — chrání před timing attacks
- Raw body před parsováním — podpis je nad raw body, ne nad parsed JSON
    `,
  },
  'troubleshooting/widget-not-showing': {
    title: 'Widget se nezobrazí',
    description: 'Jak diagnostikovat a opravit nefungující widget',
    body: `
## Nejčastější příčiny

**1. Chatbot je neaktivní**

Dashboard → Chatboti → zkontroluj přepínač **Aktivní**. Widget se zobrazí pouze pro aktivní boty.

**2. Špatné Bot ID**

Zkontroluj \`data-bot-id\` v script tagu — musí přesně odpovídat ID z dashboardu (UUID formát).

**3. Blokovaná doména**

Pokud máš nastaven seznam povolených domén (**Allowed domains**), ujisti se, že doména, odkud widget voláš, je v seznamu.

Prázdný seznam = povoleny všechny domény.

**4. Content Security Policy**

Pokud web používá CSP, přidej výjimku:

\`\`\`
Content-Security-Policy: frame-src https://botcraft.app; script-src https://botcraft.app
\`\`\`

**5. Script se nenahrál**

Otevři DevTools → Network → hledej \`widget.js\`. Pokud 404 nebo error, zkontroluj URL scriptu.

## Debugování v konzoli

\`\`\`javascript
// Spusť v konzoli prohlížeče na stránce s widgetem
document.querySelector('[data-bot-id]')  // Najde script tag
\`\`\`

## Widget je viditelný ale nic neposílá

Zkontroluj DevTools → Console pro JavaScript chyby. Zkontroluj Network → požadavky na \`/api/chat\`.
    `,
  },
  'troubleshooting/rate-limits': {
    title: 'Rate limit chyby',
    description: 'Co dělat při překročení rate limitů',
    body: `
## Typy rate limitů

BotCraft má dva typy limitů:

**1. Chat rate limit** — počet zpráv za 60 sekund (per chatbot vlastník)

| Plán | Limit |
|------|-------|
| Hobby | 5 / 60 s |
| Maker | 30 / 60 s |
| Studio | 100 / 60 s |
| Enterprise | 500 / 60 s |

**2. Měsíční limit zpráv** — celkový počet zpráv za měsíc

## Symptomy

- Chat vrátí zprávu: *"Příliš mnoho zpráv najednou. Zkus to za chvíli znovu."*
- HTTP 429 na chat nebo API endpointech
- Widget zobrazí upozornění o limitu

## Řešení

**Rate limit (dočasné)**
- Počkej 60 sekund — limit se obnoví
- Snižte počet souběžných requestů

**Měsíční limit**
- Upgraduj plán v **Billing**
- Limit se obnoví 1. dne příštího měsíce

**API rate limit**
- Implementuj exponential backoff:

\`\`\`typescript
async function fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<Response> {
  const res = await fetch(url, options)
  if (res.status === 429 && retries > 0) {
    await new Promise(r => setTimeout(r, 2 ** (3 - retries) * 1000))
    return fetchWithRetry(url, options, retries - 1)
  }
  return res
}
\`\`\`
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
