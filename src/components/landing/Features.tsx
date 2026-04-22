import { Database, Palette, Code2, Webhook, BarChart2, Server } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Custom branding',
    desc: 'Barva, avatar, welcome message. Žádný BotCraft watermark na placených plánech.',
    badge: null,
  },
  {
    icon: Database,
    title: 'RAG knowledge base',
    desc: 'Supabase pgvector. Bot odpovídá z tvých dokumentů první, AI až když neví.',
    badge: null,
  },
  {
    icon: Code2,
    title: 'One-line embed',
    desc: 'Jeden <script> tag. Žádný iframe setup, žádné SDK.',
    badge: null,
  },
  {
    icon: Webhook,
    title: 'Webhooky',
    desc: 'Slack, Discord, email nebo custom endpoint.',
    badge: 'Studio',
  },
  {
    icon: BarChart2,
    title: 'A/B testing',
    desc: 'Dva system prompty, split traffic, metriky.',
    badge: 'Studio',
  },
  {
    icon: Server,
    title: 'Self-hosted',
    desc: 'Docker compose, vlastní AI API key, vlastní data.',
    badge: 'Enterprise',
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-paper_border py-20 md:py-28 scroll-mt-14">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <h2
          className="font-mono font-medium text-ink mb-12"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Co dostaneš
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
          {features.map(({ icon: Icon, title, desc, badge }) => (
            <div key={title}>
              <Icon size={20} className="text-rust mb-3" />
              <div className="flex items-center gap-2 mb-1">
                <p className="font-mono text-sm font-medium text-ink uppercase tracking-wide">{title}</p>
                {badge && (
                  <span className="font-mono text-[10px] text-rust border border-rust px-1.5 py-0.5 uppercase tracking-wider">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
