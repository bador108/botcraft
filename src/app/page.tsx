import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'
import {
  Zap, Bot, BookOpen, Code2, MessageSquare,
  CheckCircle2, ArrowRight, Sparkles, Database, Globe,
} from 'lucide-react'

// ─── Chat UI mockup (hero) ────────────────────────────────────────────────────

function ChatMockup() {
  return (
    <div className="w-full max-w-sm mx-auto glass-card rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/40">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-[#0D0D16]">
        <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-sm">
          🤖
        </div>
        <div>
          <p className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Support Bot
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="px-4 py-4 space-y-3 min-h-[190px]">
        <div className="flex gap-2.5">
          <div className="h-6 w-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
            🤖
          </div>
          <div className="bg-white/5 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-white/75 max-w-[200px]">
            Hi! How can I help you today?
          </div>
        </div>

        <div className="flex gap-2.5 justify-end">
          <div className="bg-indigo-600/75 rounded-xl rounded-tr-sm px-3.5 py-2.5 text-xs text-white max-w-[175px]">
            What&apos;s your refund policy?
          </div>
        </div>

        <div className="flex gap-2.5">
          <div className="h-6 w-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
            🤖
          </div>
          <div className="bg-white/5 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-white/75 max-w-[210px]">
            Based on our policy, you can request a refund within 30 days...
          </div>
        </div>

        {/* Typing indicator */}
        <div className="flex gap-2.5">
          <div className="h-6 w-6 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[11px] shrink-0">
            🤖
          </div>
          <div className="bg-white/5 rounded-xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div className="flex gap-2 bg-white/5 rounded-xl px-3.5 py-2.5 border border-white/[0.07]">
          <input
            disabled
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-xs text-white/40 placeholder:text-white/20 outline-none"
          />
          <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <ArrowRight className="h-3 w-3 text-white" />
          </div>
        </div>
        <p className="text-center text-[10px] text-white/15 mt-2">Powered by BotCraft</p>
      </div>
    </div>
  )
}

// ─── Knowledge bot mockup (features section) ─────────────────────────────────

function KnowledgeMockup() {
  const messages: { from: 'bot' | 'user'; msg: string }[] = [
    { from: 'bot',  msg: 'Hello! Ask me anything about your product docs.' },
    { from: 'user', msg: 'How do I reset my password?' },
    { from: 'bot',  msg: 'Go to Settings → Security → Reset Password. A link arrives within 2 minutes.' },
  ]

  return (
    <div className="w-full max-w-xs glass-card rounded-2xl overflow-hidden shadow-2xl shadow-indigo-950/30">
      <div className="bg-[#0D0D16] px-4 py-3 border-b border-white/5 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-sm">📚</div>
        <div>
          <p className="text-xs font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Knowledge Bot</p>
          <p className="text-[10px] text-[#6B6B82]">Trained on 12 documents</p>
        </div>
        <span className="ml-auto text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-900/50">
          Active
        </span>
      </div>

      <div className="p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : ''}`}>
            {m.from === 'bot' && (
              <div className="h-5 w-5 rounded-full bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                🤖
              </div>
            )}
            <div className={`rounded-xl px-3 py-2 text-[11px] leading-relaxed max-w-[190px] ${
              m.from === 'bot'
                ? 'bg-white/5 text-white/75 rounded-tl-sm'
                : 'bg-indigo-600/70 text-white rounded-tr-sm'
            }`}>
              {m.msg}
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <div className="text-[10px] text-indigo-400 bg-indigo-950/40 border border-indigo-900/40 rounded-lg px-3 py-2 flex items-center gap-2">
          <Sparkles className="h-3 w-3 shrink-0" />
          Answered from: password-reset.md
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-[#060609] text-[#EEEEF5]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#060609]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/icon.svg" alt="BotCraft" width={26} height={26} className="rounded-lg" />
            <span className="font-semibold text-sm text-white" style={{ fontFamily: 'var(--font-display)' }}>BotCraft</span>
          </Link>
          <div className="flex gap-2 items-center">
            {userId ? (
              <Link href="/dashboard" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-[#6B6B82] hover:text-white transition-colors px-3 py-2 hidden sm:block">
                  Sign in
                </Link>
                <Link href="/sign-up" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors">
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[15%] w-[650px] h-[650px] rounded-full bg-indigo-600/10 blur-[130px] animate-glow" />
          <div
            className="absolute top-[5%] right-[5%] w-[450px] h-[450px] rounded-full bg-violet-600/[0.08] blur-[110px] animate-glow"
            style={{ animationDelay: '2.5s' }}
          />
        </div>

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-3xl mx-auto text-center mb-14">
            {/* Badge */}
            <div className="animate-fade-up inline-flex items-center gap-2 bg-indigo-950/80 text-indigo-300 text-xs font-medium px-4 py-1.5 rounded-full mb-8 border border-indigo-800/50">
              <Zap className="h-3 w-3" />
              Powered by Groq + RAG
            </div>

            {/* Heading */}
            <h1
              className="animate-fade-up-2 text-5xl md:text-6xl lg:text-[4.5rem] font-bold leading-[1.0] tracking-[-0.03em] text-white mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Build chatbots that<br />
              <span className="text-gradient">actually know</span><br />
              your product
            </h1>

            <p className="animate-fade-up-3 text-base md:text-lg text-[#6B6B82] mb-10 max-w-xl mx-auto leading-relaxed">
              Upload your docs, configure the personality, embed in one line.
              Powered by Llama 3 and DeepSeek — no AI expertise needed.
            </p>

            <div className="animate-fade-up-4 flex gap-3 justify-center flex-wrap">
              <Link
                href="/sign-up"
                className="group bg-indigo-600 text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-950/60 flex items-center gap-2"
              >
                Start building free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/sign-in"
                className="border border-white/[0.08] text-[#6B6B82] px-7 py-3 rounded-xl font-semibold text-sm hover:bg-white/5 hover:text-white transition-all duration-200"
              >
                Sign in
              </Link>
            </div>
            <p className="text-xs text-[#3F3F50] mt-4">Free plan · No credit card needed</p>
          </div>

          <ChatMockup />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-white/5 bg-[#0D0D16]/50">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-9">
          <div className="flex flex-wrap justify-center gap-10 md:gap-20">
            {[
              { value: '500+',   label: 'Chatbots deployed' },
              { value: '5 min',  label: 'Average setup time' },
              { value: '3',      label: 'AI model tiers' },
              { value: '1-line', label: 'Embed code' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{value}</p>
                <p className="text-xs text-[#6B6B82] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="text-xs text-indigo-400 tracking-[0.15em] uppercase font-medium mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Live in 3 steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[2.1rem] left-[calc(16.7%+1.5rem)] right-[calc(16.7%+1.5rem)] h-px bg-gradient-to-r from-transparent via-indigo-800/40 to-transparent" />

          {[
            { step: '01', icon: Bot,      title: 'Create your bot',  desc: 'Name, avatar, system prompt, AI model. Ready in under 2 minutes.' },
            { step: '02', icon: Database, title: 'Upload knowledge', desc: 'Drop in PDFs, TXT or Markdown. Your bot learns from them instantly.' },
            { step: '03', icon: Globe,    title: 'Embed anywhere',   desc: 'One <script> tag. Chat bubble appears on your site immediately.' },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="glass-card rounded-2xl p-6 hover:border-indigo-800/40 transition-colors duration-300">
              <div
                className="h-9 w-9 rounded-xl bg-[#0D0D16] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-indigo-400 mb-5"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {step}
              </div>
              <Icon className="h-5 w-5 text-indigo-400 mb-3 opacity-60" />
              <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
              <p className="text-sm text-[#6B6B82] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-t border-white/5 bg-[#0D0D16]/40">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs text-indigo-400 tracking-[0.15em] uppercase font-medium mb-3">Features</p>
              <h2
                className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-10"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Everything your bot needs
              </h2>
              <div className="space-y-7">
                {[
                  { icon: Bot,           title: 'Custom AI personality', desc: 'System prompt, welcome message, avatar, color. Fully branded, fully yours.' },
                  { icon: BookOpen,      title: 'RAG knowledge base',    desc: 'PDF, TXT, Markdown. Bot answers from your docs first, AI fills the gaps.' },
                  { icon: Code2,         title: 'One-line embed',        desc: 'One <script> tag. Chat bubble appears on your site instantly.' },
                  { icon: MessageSquare, title: '3 AI model tiers',      desc: 'Llama 8B (fast) · Llama 70B (smart) · DeepSeek R1 (best quality).' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="h-9 w-9 rounded-xl bg-indigo-950/60 border border-indigo-900/50 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="text-sm text-[#6B6B82] mt-0.5 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <KnowledgeMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 md:py-28">
        <div className="text-center mb-14">
          <p className="text-xs text-indigo-400 tracking-[0.15em] uppercase font-medium mb-3">Pricing</p>
          <h2
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Simple, honest pricing
          </h2>
          <p className="text-[#6B6B82] mt-3">Start free, upgrade when you need more</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              name: 'Free', price: 'Zdarma', desc: 'Try it out, no strings',
              features: ['1 chatbot', 'Llama 8B only', '100 msgs/month', '1 document', '50 chunks'],
              cta: 'Start free', popular: false,
            },
            {
              name: 'Pro', price: '250 Kč', desc: 'For growing projects',
              features: ['5 chatbots', 'All 3 AI models', '2,000 msgs/month', '20 documents', 'Unlimited chunks'],
              cta: 'Get Pro', popular: true,
            },
            {
              name: 'Business', price: '750 Kč', desc: 'For teams and agencies',
              features: ['Unlimited chatbots', 'All 3 AI models', 'Unlimited messages', 'Unlimited docs', 'Priority support'],
              cta: 'Get Business', popular: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                p.popular
                  ? 'border border-indigo-500/40 bg-indigo-950/20 shadow-xl shadow-indigo-950/50'
                  : 'border border-white/[0.06] bg-[#0D0D16]/60'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-5">
                <p className="font-medium text-sm text-[#6B6B82] mb-1">{p.name}</p>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {p.price}
                  {p.price !== 'Zdarma' && <span className="text-sm font-normal text-[#6B6B82]">/měs.</span>}
                </p>
                <p className="text-xs text-[#6B6B82] mt-1">{p.desc}</p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#6B6B82]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={`block text-center py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  p.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'border border-white/[0.08] text-[#6B6B82] hover:bg-white/5 hover:text-white'
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[320px] rounded-full bg-indigo-600/10 blur-[90px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-5 md:px-8 py-20 md:py-28 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <Image src="/icon.svg" alt="BotCraft" width={36} height={36} className="rounded-xl opacity-90" />
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>BotCraft</span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Ready to build your first chatbot?
          </h2>
          <p className="text-[#6B6B82] mb-8">Sign up in 30 seconds. Free plan, no credit card.</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-[#060609] px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="BotCraft" width={20} height={20} className="rounded-md opacity-40" />
            <span className="text-sm text-[#3F3F50] font-medium">BotCraft</span>
          </div>
          <p className="text-xs text-[#3F3F50]">© {new Date().getFullYear()} BotCraft · AI Chatbot Builder</p>
        </div>
      </footer>
    </div>
  )
}
