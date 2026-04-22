import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface Post { title: string; date: string; readTime: string; tag: string; content: string }

const posts: Record<string, Post> = {
  'jak-napsat-dobry-system-prompt': {
    title: 'Jak napsat system prompt, ktery chatbota skutecne nauci odpovidat',
    date: '15. dubna 2026', readTime: '6 min', tag: 'Navod',
    content: '<p>System prompt je nejdulezitejsi vec, kterou pro sveho chatbota napises. Vetsina lidi to podceni a pak se divi, proc bot odpovida mimo tema.</p><h2>Co system prompt dela</h2><p>System prompt dostane model pred kazdym rozhovorem. Rika mu: kdo jsi, co smis rikat, jak mas mluvit a co delat, kdyz nevis. Cim presnejsi instrukce, tim konzistentnejsi odpovedi.</p><h2>Nejcastejsi chyba: prilis obecny prompt</h2><p><strong>Spatne:</strong></p><pre>Jsi asistent pro nas e-shop.</pre><p><strong>Dobre:</strong></p><pre>Jsi zakaznicka podpora e-shopu MujShop.cz. Odpovidej strucne, vzdy cesky. Pokud otazka nesouvissi s objednavkami nebo produkty, zdvorile odmitni. Nikdy nevymyslej informace — pokud nevis, rekni to.</pre><h2>Struktura dobreho promptu</h2><ol><li><strong>Role:</strong> kdo je bot a pro koho pracuje</li><li><strong>Tema:</strong> co smi a nesmi resit</li><li><strong>Styl:</strong> ton, delka odpovedi, jazyk</li><li><strong>Fallback:</strong> co delat, kdyz nezna odpoved</li></ol><h2>Testuj a iteruj</h2><p>Kazdy prompt si odzkousej alespon 10 ruznymi otazkami. Sleduj, kdy selze, a pridej instrukci pro ten pripad. Dobre prompty vznikaji iteraci, ne na prvni pokus.</p>',
  },
  'rag-vs-fine-tuning': {
    title: 'RAG vs. fine-tuning: Kdy se co vyplati (a proc skoro vzdy RAG)',
    date: '8. dubna 2026', readTime: '8 min', tag: 'Technicke',
    content: '<p>Kdyz lidem reknu, ze BotCraft stavi na RAG a ne na fine-tuningu, prvni reakce byva: &bdquo;Ale fine-tuning musi byt lepsi, ne?&ldquo; Neni to tak jednoduche.</p><h2>Co je RAG</h2><p>RAG (Retrieval-Augmented Generation) funguje tak, ze pred kazdou odpovedi model dostane relevantni vynatky z tvych dokumentu. Bot nehledisi do naucenych vah, ale do zivych dat v kontextu. Vysledek: aktualni, konkretni odpovedi bez halucinaci.</p><h2>Co je fine-tuning</h2><p>Fine-tuning pretrenuje vahy modelu na tvych datech. Potrebujes stovky kvalitnich prikladu, pretrenovanisi stoji penize, a pokud data aktualizujes — musi trénovat znovu.</p><h2>Kdy RAG, kdy fine-tuning</h2><ul><li>Odpovidash z dokumentu, FAQ, manualu &rarr; <strong>RAG</strong></li><li>Data se meni nebo pribyvayi &rarr; <strong>RAG</strong></li><li>Chces konkretni fakta bez halucinaci &rarr; <strong>RAG</strong></li><li>Chces specificky ton nebo styl psani &rarr; <strong>Fine-tuning</strong></li><li>Mas 1000+ kvalitnich prikladu &rarr; <strong>Fine-tuning</strong></li></ul><h2>Proc jsme zvolili RAG</h2><p>Pro 95 % zakazniku je cil stejny: bot ma znat jejich produkty a odpovidat z nich. RAG to zvladne za par minut bez jakehokoli trenovani. Fine-tuning ma smysl, ale je to jiny nastroj pro jiny problem.</p>',
  },
  'chatbot-na-webu-bez-kodu': {
    title: 'Chatbot na webu za 5 minut bez jedine radky kodu',
    date: '2. dubna 2026', readTime: '4 min', tag: 'Navod',
    content: '<p>Opravdu to jde za 5 minut. Projdeme si cely proces od registrace po funkcni widget na tvem webu.</p><h2>Krok 1: Vytvor bota</h2><p>Po registraci klikni na Novy chatbot. Zadej nazev, uvitaci zpravu a system prompt. Vyber model: Fast pro rychle odpovedi, Balanced pro lepsi kvalitu, Premium pro slozite otazky.</p><h2>Krok 2: Nahraj dokumenty</h2><p>Prejdi na zalozku Znalosti a nahraj PDF, TXT nebo Markdown soubory. BotCraft je automaticky rozseka na casti (chunks), vytvori embeddingy a ulozi do vektorove databaze. Bot ted umi odpovidat z tveho obsahu.</p><p>Tip: cim cistsi dokument, tim lepsi odpovedi. Naskenovane PDF bez OCR nefunguje dobre — pouzij textove PDF nebo Markdown export.</p><h2>Krok 3: Embed na web</h2><p>Prejdi na zalozku Integrace a zkopiruj script tag:</p><pre>&lt;script src="https://botcraft.app/widget.js" data-bot-id="tvuj-bot-id" defer&gt;&lt;/script&gt;</pre><p>Vloz ho pred uzaviraci body tag na svem webu. Chat bublina se okamzite objevi v pravem rohu.</p><h2>Co dal</h2><p>V nastaveni bota muzes zmenit barvu widgetu, pozici, uvitaci zpravu a avatar. V analytice vidis kolik zprav bot zodpovedel a kde selhal.</p>',
  },
  'co-jsme-zjistili-o-pricingu': {
    title: 'Proc jsme presli z tri planu na ctyri — a co jsme se naucili o pricing',
    date: '25. brezen 2026', readTime: '5 min', tag: 'Byznys',
    content: '<p>Puvodne jsme meli tri plany: Free, Pro a Business. Po trech mesicich jsme to prepracovali. Tady je uprimne proc.</p><h2>Problem s tremi plany</h2><p>Free plan konvertoval dobre. Problem byl prechod z Free na Pro — cena skocila z 0 na 490 Kc/mes a pro jednotlivce to byl prilis velky skok bez mezikroku. Vysledek: hodne lidi zustalo na Free a narazelo na limity.</p><h2>Co jsme zmenili</h2><p>Pridali jsme plan Maker mezi Free a Pro. Nizsi cena, mene chatbotu, ale dost pro freelancera. Tim jsme snizili barierů prvniho placeni. Zaroven jsme zpresnnili, co kazdy plan obsahuje — zadne zavadejici &bdquo;neomezeno&ldquo;.</p><h2>Co jsme se naucili</h2><ol><li><strong>Cenovy skok nad 300 Kc v jednom kroku zabi konverze.</strong></li><li><strong>Neomezene je lez, ktere zakaznici prokouknou.</strong> Radej rikej presna cisla.</li><li><strong>Free plan musi bolet, ne frustrovat.</strong> Limit ktery donuti k upgradu je jiny nez limit ktery uzivatele otravi.</li></ol><h2>Vysledek</h2><p>Konverze z Free na placene plany vzrostla o 34 % v prvnim mesici po zmene. Pricinge neni veda, ale je to iterace.</p>',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return { title: 'Clanek nenalezen — BotCraft' }
  return { title: `${post.title} — BotCraft Blog`, description: post.title }
}

const TAG_COLORS: Record<string, string> = {
  'Navod':    'text-[#D4500A] bg-[#D4500A]/10',
  'Technicke':'text-[#2563EB] bg-[#2563EB]/10',
  'Byznys':  'text-[#059669] bg-[#059669]/10',
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
        <p className="text-xs text-[#A8A8A8]">{post.date} &middot; {post.readTime} cteni</p>
      </div>
      <hr className="border-[#F2F2EF] mb-10" />
      <div
        className="[&>p]:text-[#6B6B6B] [&>p]:leading-relaxed [&>p]:mb-5 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#0A0A0A] [&>h2]:mt-10 [&>h2]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:mb-5 [&>ul>li]:text-[#6B6B6B] [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:mb-5 [&>ol>li]:text-[#6B6B6B] [&_strong]:text-[#0A0A0A] [&>pre]:bg-[#F2F2EF] [&>pre]:text-[#0A0A0A] [&>pre]:rounded-xl [&>pre]:p-4 [&>pre]:text-sm [&>pre]:overflow-x-auto [&>pre]:mb-5 [&>pre]:font-mono [&>pre]:whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  )
}
