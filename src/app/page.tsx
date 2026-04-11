import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Zap, Bot, BookOpen, Code2, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react'

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 sticky top-0 z-10 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">BotCraft</span>
          </div>
          <div className="flex gap-3 items-center">
            {userId ? (
              <Link href="/dashboard" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white px-4 py-2 transition">Sign in</Link>
                <Link href="/sign-up" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Start free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-950 text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-900">
          <Zap className="h-3.5 w-3.5" />
          Powered by Groq + RAG
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Build AI chatbots<br />
          <span className="text-indigo-400">with your own knowledge</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Upload documents, configure your bot, and embed it on any website in minutes.
          Powered by Llama 3 and DeepSeek — blazing fast.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/sign-up" className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/50">
            Start for free <ArrowRight className="inline h-4 w-4 ml-1" />
          </Link>
          <Link href="/sign-in" className="border border-gray-700 text-gray-300 px-8 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-800 transition">
            Sign in
          </Link>
        </div>
        <p className="text-sm text-gray-600 mt-4">Free plan · No credit card needed</p>
      </section>

      {/* Features */}
      <section className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center mb-14">Everything you need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Bot, title: 'Custom AI Bots', desc: 'Name, avatar, system prompt, welcome message, theme color.' },
              { icon: BookOpen, title: 'Knowledge Base (RAG)', desc: 'Upload PDFs, TXT, MD. Bot answers from your docs first.' },
              { icon: Code2, title: 'One-line Embed', desc: 'Copy a <script> tag and paste it anywhere on your site.' },
              { icon: MessageSquare, title: 'Groq Powered', desc: 'Llama 8B, 70B and DeepSeek R1 — pick speed or quality.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="h-10 w-10 rounded-lg bg-indigo-900/50 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <p className="font-semibold mb-1">{title}</p>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-12">Start free, upgrade when you need more</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Free', price: '$0', features: ['1 chatbot', 'Llama 8B only', '100 msgs/month', '1 document', '50 chunks'], cta: 'Get started' },
            { name: 'Pro', price: '$9', popular: true, features: ['5 chatbots', 'All models', '2000 msgs/month', '20 documents', 'Unlimited chunks'], cta: 'Start Pro' },
            { name: 'Business', price: '$29', features: ['Unlimited chatbots', 'All models', 'Unlimited msgs', 'Unlimited docs', 'Priority support'], cta: 'Start Business' },
          ].map(p => (
            <div key={p.name} className={`rounded-2xl p-6 border ${p.popular ? 'border-indigo-500 bg-indigo-950/40' : 'border-gray-700 bg-gray-900'}`}>
              {p.popular && <div className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-wider">Most Popular</div>}
              <p className="font-bold text-lg">{p.name}</p>
              <p className="text-3xl font-bold mt-1 mb-4">{p.price}<span className="text-base font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-2 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className={`block text-center py-2.5 rounded-xl font-medium text-sm transition ${p.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border border-gray-600 text-gray-300 hover:bg-gray-800'}`}>
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-5 w-5 rounded bg-indigo-600 flex items-center justify-center">
            <Zap className="h-3 w-3 text-white" />
          </div>
          <span className="font-semibold text-gray-400">BotCraft</span>
        </div>
        © {new Date().getFullYear()} BotCraft · AI Chatbot Builder
      </footer>
    </div>
  )
}
