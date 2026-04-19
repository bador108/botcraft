import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — BotCraft',
  description: 'Návody, úvahy a občas i trocha rantu o AI chatbotech, embed widgetech a tom, jak to všechno dělat správně.',
}

const posts = [
  {
    slug: 'jak-napsat-dobry-system-prompt',
    title: 'Jak napsat system prompt, který chatbota skutečně naučí odpovídat',
    excerpt:
      'System prompt je nejdůležitější 500 znaků tvého bota. Projdeme si, co tam patří, co ne, a proč většina lidí dělá jednu a tu stejnou chybu.',
    date: '15. dubna 2026',
    readTime: '6 min',
    tag: 'Návod',
  },
  {
    slug: 'rag-vs-fine-tuning',
    title: 'RAG vs. fine-tuning: Kdy se co vyplatí (a proč skoro vždy RAG)',
    excerpt:
      'Fine-tuning zní sexy, ale pro 95 % use-casů ti stačí dobré RAG s kvalitními dokumenty. Vysvětlím proč a kdy je ta 5% výjimka.',
    date: '8. dubna 2026',
    readTime: '8 min',
    tag: 'Technické',
  },
  {
    slug: 'chatbot-na-webu-bez-kodu',
    title: 'Chatbot na webu za 5 minut bez jediné řádky kódu',
    excerpt:
      'Upload, konfigurace, embed. Krok za krokem, od PDF souboru s FAQ po funkční widget v rohu tvého e-shopu.',
    date: '2. dubna 2026',
    readTime: '4 min',
    tag: 'Návod',
  },
  {
    slug: 'co-jsme-zjistili-o-pricingu',
    title: 'Proč jsme přešli z tří plánů na čtyři — a co jsme se naučili o pricing',
    excerpt:
      'Původně jsme měli Free / Pro / Business. Po třech měsících jsme to přepracovali. Tady je upřímné „proč".',
    date: '25. března 2026',
    readTime: '5 min',
    tag: 'Byznys',
  },
]

export default function BlogPage() {
  return (
    <div>
      <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3">Blog</p>
      <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">Čtení</h1>
      <p className="text-zinc-500 text-sm mb-14 max-w-xl">
        Návody, úvahy a občas i trocha rantu o AI chatbotech, embed widgetech a tom, jak to všechno
        dělat, aby to nevypadalo jako z roku 2020.
      </p>

      <div>
        {posts.map((post, i) => (
          <article
            key={post.slug}
            className={`py-8 ${i !== posts.length - 1 ? 'border-b border-white/[0.06]' : ''}`}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">
                {post.tag}
              </span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-[11px] text-zinc-600">{post.date}</span>
              <span className="text-zinc-700 text-xs">·</span>
              <span className="text-[11px] text-zinc-600">{post.readTime}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-2 leading-snug tracking-tight">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-zinc-300 transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
