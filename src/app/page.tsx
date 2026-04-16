import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'
import { ArrowRight, CheckCircle2, Bot, BookOpen, Code2, MessageSquare } from 'lucide-react'

// ─── Syntax-highlighted embed snippet ────────────────────────────────────────

function EmbedSnippet() {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.07] text-[13px] leading-relaxed">
      {/* Tab bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0D0D12] border-b border-white/[0.07]">
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="ml-3 text-[11px] text-zinc-500 font-mono">index.html</span>
      </div>

      {/* Code */}
      <pre className="bg-[#09090D] px-5 py-5 overflow-x-auto font-mono">
        <code>
          <Line n={1}>
            <span className="text-zinc-600">{'<!-- Add BotCraft to your site -->'}</span>
          </Line>
          <Line n={2}>
            <span className="text-indigo-400">{'<script'}</span>
          </Line>
          <Line n={3}>
            {'  '}
            <span className="text-lime-400">src</span>
            <span className="text-zinc-400">{'="'}</span>
            <span className="text-orange-300">{'https://botcraft.vercel.app/widget.js'}</span>
            <span className="text-zinc-400">{'"'}</span>
          </Line>
          <Line n={4}>
            {'  '}
            <span className="text-lime-400">data-bot-id</span>
            <span className="text-zinc-400">{'="'}</span>
            <span className="text-orange-300">your-bot-id</span>
            <span className="text-zinc-400">{'"'}</span>
          </Line>
          <Line n={5}>
            {'  '}
            <span className="text-lime-400">async</span>
            <span className="text-indigo-400">{'>'}</span>
          </Line>
          <Line n={6}>
            <span className="text-indigo-400">{'</script>'}</span>
          </Line>
        </code>
      </pre>

      {/* Footer */}
      <div className="px-4 py-2.5 bg-[#0D0D12] border-t border-white/[0.07] flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="text-[11px] text-zinc-500 font-mono">Chat bubble appears automatically</span>
      </div>
    </div>
  )
}

function Line({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <span className="select-none text-zinc-700 w-4 shrink-0 text-right">{n}</span>
      <span>{children}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-200">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090B]/90 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.svg" alt="BotCraft" width={24} height={24} className="rounded-md" />
            <span className="font-semibold text-sm text-white font-display">BotCraft</span>
          </Link>
          <div className="flex gap-2 items-center">
            {userId ? (
              <Link href="/dashboard" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-500 transition-colors font-medium">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-zinc-500 hover:text-white transition-colors px-3 py-1.5 hidden sm:block">
                  Sign in
                </Link>
                <Link href="/sign-up" className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-500 transition-colors font-medium">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 pt-20 pb-20 md:pt-28 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Text */}
          <div>
            <p className="animate-fade-up text-xs text-zinc-500 uppercase tracking-[0.18em] font-medium mb-6">
              AI Chatbot Builder
            </p>
            <h1 className="animate-fade-up-2 font-display text-5xl md:text-6xl font-bold text-white leading-[1.0] tracking-[-0.03em] mb-6">
              Your docs.<br />
              Your chatbot.<br />
              <span className="text-zinc-500">Anywhere.</span>
            </h1>
            <p className="animate-fade-up-3 text-base text-zinc-400 mb-8 leading-relaxed max-w-md">
              Upload your documents, configure the bot, paste one script tag.
              Powered by Llama 3 and DeepSeek — no ML knowledge needed.
            </p>
            <div className="animate-fade-up-4 flex items-center gap-3 flex-wrap">
              <Link
                href="/sign-up"
                className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-500 transition-colors"
              >
                Start for free
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/sign-in" className="text-sm text-zinc-500 hover:text-white transition-colors">
                Sign in →
              </Link>
            </div>
            <p className="text-xs text-zinc-700 mt-4">Free plan · No credit card</p>
          </div>

          {/* Code block */}
          <div className="animate-fade-up-3">
            <EmbedSnippet />
          </div>
        </div>
      </section>

      {/* ── Thin rule with quick facts ── */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-5 flex flex-wrap items-center gap-6 md:gap-10 text-xs text-zinc-600">
          <span>3 AI model tiers</span>
          <span className="text-zinc-800">·</span>
          <span>PDF · TXT · Markdown</span>
          <span className="text-zinc-800">·</span>
          <span>RAG knowledge base</span>
          <span className="text-zinc-800">·</span>
          <span>1-line embed</span>
          <span className="text-zinc-800">·</span>
          <span>Free plan</span>
        </div>
      </div>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3">Process</p>
            <h2 className="font-display text-3xl font-bold text-white tracking-tight leading-tight">
              Three steps,<br />live chatbot.
            </h2>
          </div>
          <div className="space-y-0 divide-y divide-white/[0.06]">
            {[
              { n: '01', title: 'Create your bot', desc: 'Set a name, avatar, system prompt and choose your AI model — from fast Llama 8B to powerful DeepSeek R1.' },
              { n: '02', title: 'Upload your knowledge', desc: 'Drop in PDFs, TXT or Markdown files. Your bot learns from them and answers questions based on your content.' },
              { n: '03', title: 'Paste one script tag', desc: 'Copy the generated <script> snippet and paste it into your site. A chat bubble appears in the bottom-right corner.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-6 py-6">
                <span className="font-mono text-xs text-indigo-500 pt-0.5 shrink-0 w-6">{n}</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">{title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 md:gap-16 items-start">
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3">What you get</p>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight leading-tight">
                Built for<br />real projects.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {[
                { icon: Bot,           title: 'Custom personality',   desc: 'System prompt, welcome message, avatar and brand color. Fully yours.' },
                { icon: BookOpen,      title: 'RAG knowledge base',   desc: 'Your docs go in. Bot answers from them first — AI fills the gaps.' },
                { icon: Code2,         title: 'One-line embed',       desc: 'One <script> tag. No iframe setup, no complex SDK.' },
                { icon: MessageSquare, title: 'Model choice',         desc: 'Llama 8B for speed, Llama 70B for quality, DeepSeek R1 for depth.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title}>
                  <Icon className="h-4 w-4 text-indigo-400 mb-3" />
                  <p className="font-semibold text-white text-sm mb-1">{title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="mb-12">
            <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3">Pricing</p>
            <h2 className="font-display text-3xl font-bold text-white tracking-tight">
              Pay for what you need.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: 'Free', price: 'Zdarma', period: null,
                desc: 'Try it out',
                features: ['1 chatbot', 'Llama 8B', '100 msgs/month', '1 document'],
                cta: 'Start free', highlight: false,
              },
              {
                name: 'Pro', price: '250 Kč', period: '/měs.',
                desc: 'Growing projects',
                features: ['5 chatbots', 'All 3 models', '2,000 msgs/month', '20 documents'],
                cta: 'Get Pro', highlight: true,
              },
              {
                name: 'Business', price: '750 Kč', period: '/měs.',
                desc: 'Teams & agencies',
                features: ['Unlimited chatbots', 'All 3 models', 'Unlimited messages', 'Priority support'],
                cta: 'Get Business', highlight: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`rounded-xl p-6 flex flex-col border ${
                  p.highlight
                    ? 'border-indigo-500/50 bg-indigo-950/15'
                    : 'border-white/[0.06] bg-[#0E0E12]'
                }`}
              >
                <p className="text-xs text-zinc-500 mb-1">{p.name}</p>
                <p className="font-display text-2xl font-bold text-white mb-0.5">
                  {p.price}
                  {p.period && <span className="text-sm font-normal text-zinc-500">{p.period}</span>}
                </p>
                <p className="text-xs text-zinc-600 mb-5">{p.desc}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block text-center py-2 rounded-lg font-medium text-sm transition-colors ${
                    p.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-2">
              Build your first chatbot today.
            </h2>
            <p className="text-zinc-500 text-sm">Free plan · No credit card · Setup in 5 minutes.</p>
          </div>
          <Link
            href="/sign-up"
            className="shrink-0 inline-flex items-center gap-2 bg-white text-zinc-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-100 transition-colors"
          >
            Get started free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-7">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="BotCraft" width={18} height={18} className="rounded-sm opacity-40" />
            <span className="text-xs text-zinc-700">BotCraft</span>
          </div>
          <p className="text-xs text-zinc-700">© {new Date().getFullYear()} BotCraft</p>
        </div>
      </footer>
    </div>
  )
}
