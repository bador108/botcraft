import Link from 'next/link'
import Image from 'next/image'
import { auth } from '@clerk/nextjs/server'
import { Zap, Bot, BookOpen, Code2, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react'

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 sticky top-0 z-10 bg-gray-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="BotCraft" width={140} height={32} priority />
          </Link>
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
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-950 text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-indigo-900">
            <Zap className="h-3.5 w-3.5" />
            Powered by Groq + RAG
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Build AI chatbots<br />
            <span className="text-indigo-400">with your own knowledge</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Upload documents, configure your bot, and embed it on any website with one line of code. Powered by Llama 3 and DeepSeek.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/sign-up" className="bg-indigo-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/50">
              Start for free <ArrowRight className="inline h-4 w-4 ml-1" />
            </Link>
            <Link href="/sign-in" className="border border-gray-700 text-gray-300 px-7 py-3 rounded-xl font-semibold hover:bg-gray-800 transition">
              Sign in
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-4">Free plan · No credit card needed</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96">
          <Image
            src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80"
            alt="AI chatbot interface"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-indigo-600/20 rounded-lg flex items-center justify-center shrink-0 text-lg">🤖</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Support Bot</p>
                <p className="text-xs text-gray-400">Based on your knowledge base · 1 243 messages</p>
              </div>
              <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2.5 py-1 rounded-full font-medium border border-emerald-800">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-gray-800 bg-gray-900/30 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-6">Used by developers, agencies & businesses</p>
          <div className="flex flex-wrap justify-center gap-10">
            {['SaaS Founders', 'Agencies', 'E-commerce', 'Support Teams', 'Freelancers'].map(r => (
              <span key={r} className="text-gray-500 font-medium text-sm">{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="text-gray-400 mt-2">Your chatbot live in 3 steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: '01', title: 'Create your bot',
              desc: 'Set a name, avatar, system prompt and choose your AI model — from fast Llama 8B to powerful DeepSeek R1.',
              img: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600&q=80',
            },
            {
              step: '02', title: 'Upload knowledge',
              desc: 'Drop in PDFs, TXT or Markdown files. Your bot learns from them and answers questions based on your content.',
              img: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80',
            },
            {
              step: '03', title: 'Embed anywhere',
              desc: 'Copy one script tag and paste it into your website. A chat bubble appears in the bottom-right corner.',
              img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
            },
          ].map(({ step, title, desc, img }) => (
            <div key={step} className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden group">
              <div className="relative h-44 overflow-hidden">
                <Image src={img} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                <div className="absolute inset-0 bg-gray-950/40" />
                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{step}</div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features with image */}
      <section className="border-y border-gray-800 bg-gray-900/30 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80"
              alt="AI features"
              fill className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            {[
              { icon: Bot, title: 'Custom AI personality', desc: 'System prompt, welcome message, avatar, color — fully yours.' },
              { icon: BookOpen, title: 'RAG knowledge base', desc: 'PDF, TXT, MD upload. Bot answers from your docs first, AI fills the gaps.' },
              { icon: Code2, title: 'One-line embed', desc: 'One <script> tag. Chat bubble appears on your site instantly.' },
              { icon: MessageSquare, title: '3 AI model tiers', desc: 'Llama 8B (fast), Llama 70B (smart), DeepSeek R1 (best quality).' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="h-10 w-10 bg-indigo-900/50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-800">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-3">Simple pricing</h2>
        <p className="text-gray-400 mb-12">Start free, upgrade when you need more</p>
        <div className="grid md:grid-cols-3 gap-6 text-left">
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

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image src="/icon.svg" alt="BotCraft" width={40} height={40} className="rounded-xl" unoptimized />
            <span className="text-2xl font-bold text-white">BotCraft</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Ready to build your first chatbot?</h2>
          <p className="text-indigo-200 mb-8">Sign up in 30 seconds. No credit card required.</p>
          <Link href="/sign-up" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-indigo-50 transition inline-block">
            Start for free →
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Image src="/icon.svg" alt="BotCraft" width={22} height={22} className="rounded-md opacity-60" unoptimized />
          <span className="font-semibold text-gray-500">BotCraft</span>
        </div>
        © {new Date().getFullYear()} BotCraft · AI Chatbot Builder
      </footer>
    </div>
  )
}
