import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Post { title: string; date: string; readTime: string; tag: string; content: string }

const posts: Record<string, Post> = {
  'jak-napsat-dobry-system-prompt': {
    title: 'Jak napsat system prompt, který chatbota skutečně naučí odpovídat',
    date: '15. dubna 2026', readTime: '6 min', tag: 'Návod',
    content: '<p>System prompt je nejdůležitější věc, kterou pro svého chatbota napíšeš. Většina lidí to podcení a pak se diví, proč bot odpovídá mimo téma.</p><h2>Co system prompt dělá</h2><p>System prompt dostane model před každým rozhovorem. Říká mu: kdo jsi, co smíš říkat, jak máš mluvit a co dělat, když nevíš. Čím přesnější instrukce, tím konzistentnější odpovědi.</p><h2>Nejčastější chyba: příliš obecný prompt</h2><p><strong>Špatně:</strong></p><pre>Jsi asistent pro náš e-shop.</pre><p><strong>Dobře:</strong></p><pre>Jsi zákaznická podpora e-shopu MůjShop.cz. Odpovídej stručně, vždy česky. Pokud otázka nesouvisí s objednávkami nebo produkty, zdvořile odmítni. Nikdy nevymýšlej informace — pokud nevíš, řekni to.</pre><h2>Struktura dobrého promptu</h2><ol><li><strong>Role:</strong> kdo je bot a pro koho pracuje</li><li><strong>Téma:</strong> co smí a nesmí řešit</li><li><strong>Styl:</strong> tón, délka odpovědí, jazyk</li><li><strong>Fallback:</strong> co dělat, když nezná odpověď</li></ol><h2>Testuj a iteruj</h2><p>Každý prompt si odzkoušej alespoň 10 různými otázkami. Sleduj, kdy selže, a přidej instrukci pro ten případ. Dobré prompty vznikají iterací, ne na první pokus.</p>',
  },
  'rag-vs-fine-tuning': {
    title: 'RAG vs. fine-tuning: Kdy se co vyplatí (a proč skoro vždy RAG)',
    date: '8. dubna 2026', readTime: '8 min', tag: 'Technické',
    content: '<p>Když lidem řeknu, že BotCraft staví na RAG a ne na fine-tuningu, první reakce bývá: &bdquo;Ale fine-tuning musí být lepší, ne?&ldquo; Není to tak jednoduché.</p><h2>Co je RAG</h2><p>RAG (Retrieval-Augmented Generation) funguje tak, že před každou odpovědí model dostane relevantní výňatky z tvých dokumentů. Bot nehledí do naučených vah, ale do živých dat v kontextu. Výsledek: aktuální, konkrétní odpovědi bez halucinací.</p><h2>Co je fine-tuning</h2><p>Fine-tuning přetrénuje váhy modelu na tvých datech. Potřebuješ stovky kvalitních příkladů, přetrénování stojí peníze, a pokud data aktualizuješ — musíš trénovat znovu.</p><h2>Kdy RAG, kdy fine-tuning</h2><ul><li>Odpovídáš z dokumentů, FAQ, manuálů &rarr; <strong>RAG</strong></li><li>Data se mění nebo přibývají &rarr; <strong>RAG</strong></li><li>Chceš konkrétní fakta bez halucinací &rarr; <strong>RAG</strong></li><li>Chceš specifický tón nebo styl psaní &rarr; <strong>Fine-tuning</strong></li><li>Máš 1000+ kvalitních příkladů &rarr; <strong>Fine-tuning</strong></li></ul><h2>Proč jsme zvolili RAG</h2><p>Pro 95 % zákazníků je cíl stejný: bot má znát jejich produkty a odpovídat z nich. RAG to zvládne za pár minut bez jakéhokoli trénování. Fine-tuning má smysl, ale je to jiný nástroj pro jiný problém.</p>',
  },
  'chatbot-na-webu-bez-kodu': {
    title: 'Chatbot na webu za 5 minut bez jediné řádky kódu',
    date: '2. dubna 2026', readTime: '4 min', tag: 'Návod',
    content: '<p>Opravdu to jde za 5 minut. Projdeme si celý proces od registrace po funkční widget na tvém webu.</p><h2>Krok 1: Vytvoř bota</h2><p>Po registraci klikni na Nový chatbot. Zadej název, uvítací zprávu a system prompt. Vyber model: Fast pro rychlé odpovědi, Balanced pro lepší kvalitu, Premium pro složité otázky.</p><h2>Krok 2: Nahraj dokumenty</h2><p>Přejdi na záložku Znalosti a nahraj PDF, TXT nebo Markdown soubory. BotCraft je automaticky rozseká na části (chunks), vytvoří embeddingy a uloží do vektorové databáze. Bot teď umí odpovídat z tvého obsahu.</p><p>Tip: čím čistší dokument, tím lepší odpovědi. Naskenované PDF bez OCR nefunguje dobře — použij textové PDF nebo Markdown export.</p><h2>Krok 3: Embed na web</h2><p>Přejdi na záložku Integrace a zkopíruj script tag:</p><pre>&lt;script src="https://botcraft.app/widget.js" data-bot-id="tvůj-bot-id" defer&gt;&lt;/script&gt;</pre><p>Vlož ho před uzavírací body tag na svém webu. Chat bublina se okamžitě objeví v pravém rohu.</p><h2>Co dál</h2><p>V nastavení bota můžeš změnit barvu widgetu, pozici, uvítací zprávu a avatar. V analytice vidíš, kolik zpráv bot zodpověděl a kde selhal.</p>',
  },
  'co-jsme-zjistili-o-pricingu': {
    title: 'Proč jsme přešli z tří plánů na čtyři — a co jsme se naučili o pricing',
    date: '25. března 2026', readTime: '5 min', tag: 'Byznys',
    content: '<p>Původně jsme měli tři plány: Free, Pro a Business. Po třech měsících jsme to přepracovali. Tady je upřímné proč.</p><h2>Problém s třemi plány</h2><p>Free plán konvertoval dobře. Problém byl přechod z Free na Pro — cena skočila z 0 na 490 Kč/měs a pro jednotlivce to byl příliš velký skok bez mezikroku. Výsledek: hodně lidí zůstalo na Free a naráželo na limity.</p><h2>Co jsme změnili</h2><p>Přidali jsme plán Maker mezi Free a Pro. Nižší cena, méně chatbotů, ale dost pro freelancera. Tím jsme snížili bariéru prvního placení. Zároveň jsme zpřesnili, co každý plán obsahuje — žádné zavádějící &bdquo;neomezeno&ldquo;.</p><h2>Co jsme se naučili</h2><ol><li><strong>Cenový skok nad 300 Kč v jednom kroku zabíjí konverze.</strong></li><li><strong>Neomezené je lež, které zákazníci prokouknou.</strong> Raděj říkej přesná čísla.</li><li><strong>Free plán musí bolet, ne frustrovat.</strong> Limit který donutí k upgradu je jiný než limit který uživatele otráví.</li></ol><h2>Výsledek</h2><p>Konverze z Free na placené plány vzrostla o 34 % v prvním měsíci po změně. Pricing není věda, ale je to iterace. Neboj se měnit a měř výsledky.</p>',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return { title: 'Článek nenalezen — BotCraft' }
  return { title: `${post.title} — BotCraft Blog`, description: post.title }
}

const TAG_COLORS: Record<string, string> = {
  'Návod':     'text-[#D4500A] bg-[#D4500A]/10',
  'Technické': 'text-[#2563EB] bg-[#2563EB]/10',
  'Byznys':    'text-[#059669] bg-[#059669]/10',
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug]
  if (!post) notFound()

  return (
    <div className="max-w-2xl">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-[#A8A8A8] hover:text-[#6B6B6B] transition-colors mb-12">
        <ArrowLeft className="h-3 w-3" />
        Blog
      </Link>
      <div className="mb-8">
        <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${TAG_COLORS[post.tag] ?? 'text-[#6B6B6B] bg-[#F2F2EF]'}`}>
          {post.tag}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0A0A0A] tracking-tight mb-4 leading-tight">{post.title}</h1>
        <p className="text-xs text-[#A8A8A8]">{post.date} &middot; {post.readTime} čtení</p>
      </div>
      <hr className="border-[#F2F2EF] mb-10" />
      <div
        className="[&>p]:text-[#6B6B6B] [&>p]:leading-relaxed [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#0A0A0A] [&>h2]:mt-10 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:mb-5 [&>ul>li]:text-[#6B6B6B] [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:mb-5 [&>ol>li]:text-[#6B6B6B] [&_strong]:text-[#0A0A0A] [&>pre]:bg-[#F2F2EF] [&>pre]:text-[#0A0A0A] [&>pre]:rounded-xl [&>pre]:p-4 [&>pre]:text-sm [&>pre]:overflow-x-auto [&>pre]:mb-5 [&>pre]:font-mono [&>pre]:whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  )
}
