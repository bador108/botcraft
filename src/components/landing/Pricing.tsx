import Link from 'next/link'

const plans = [
  {
    name: 'Hobby',
    price: '0 Kč',
    period: '/ navždy',
    desc: 'Pro osobní projekty',
    popular: false,
    features: [
      '1 chatbot',
      'Fast model',
      '50 zpráv/měs (hard cap)',
      '1 dokument, max 2 MB',
      '"Powered by BotCraft" badge',
      'Komunitní support',
    ],
    note: 'Po dosažení limitu widget uživatelům slušně řekne, že se bot vrátí příští měsíc. Žádné auto-billing.',
    cta: 'Začít zdarma',
    ctaHref: '/sign-up',
    ctaVariant: 'ghost' as const,
  },
  {
    name: 'Maker',
    price: '490 Kč',
    period: '/ měs',
    desc: 'Když projekt už něco dělá',
    popular: true,
    features: [
      '5 chatbotů',
      'Fast + Balanced modely',
      '4 000 zpráv/měs',
      '20 dokumentů (150 MB)',
      'Plné RAG (embeddings + vector search)',
      'Custom branding, bez badge',
      'Základní analytika',
      'CSV export',
      'Email support',
    ],
    note: 'nebo 4 900 Kč/rok (2 měsíce zdarma)',
    cta: 'Získat Maker',
    ctaHref: '/sign-up',
    ctaVariant: 'primary' as const,
  },
  {
    name: 'Studio',
    price: '1 290 Kč',
    period: '/ měs',
    desc: 'Pro agentury a serióznější byznys',
    popular: false,
    features: [
      'Neomezeně chatbotů',
      'Všechny 3 modely (Premium limit 2 000 zpráv)',
      '15 000 zpráv/měs',
      'Neomezeně dokumentů',
      'Custom doména widgetu',
      'Webhooky',
      'A/B testing',
      'Pokročilá analytika',
      'Team seats (3)',
      'Priority support (<12h)',
      'White-label',
    ],
    note: 'nebo 12 900 Kč/rok',
    cta: 'Získat Studio',
    ctaHref: '/sign-up',
    ctaVariant: 'primary' as const,
  },
  {
    name: 'Enterprise',
    price: 'Na vyžádání',
    period: null,
    desc: 'Pro velké firmy',
    popular: false,
    features: [
      'Self-hosted (Docker)',
      'Neomezené zprávy',
      'SLA 99.9%',
      'SSO/SAML',
      'Dedicated support',
      'BYOK (vlastní AI API key)',
    ],
    note: null,
    cta: 'Kontakt',
    ctaHref: 'mailto:hello@botcraft.app',
    ctaVariant: 'ghost' as const,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-paper_border py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <h2
          className="font-mono font-medium text-ink mb-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Zaplať za to, co potřebuješ — a nic navíc
        </h2>
        <p className="text-muted text-sm mb-12 max-w-xl">
          Branding removal, custom doména, webhooky — všechno v ceně plánu. Žádné add-ony.
        </p>

        {/* Pricing table — 4 sloupce, oddělené svislými linkami */}
        <div className="border-t border-b border-paper_border">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-paper_border">
            {plans.map(plan => (
              <div key={plan.name} className="p-6 lg:p-8 flex flex-col">
                {/* Popular badge */}
                {plan.popular ? (
                  <span className="font-mono text-[10px] text-rust uppercase tracking-wider mb-1">
                    Nejčastější volba
                  </span>
                ) : (
                  <span className="h-[18px] mb-1" />
                )}

                <p className="font-mono text-lg font-medium text-ink">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1 mb-0.5">
                  <span className="font-mono text-2xl font-semibold text-ink">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted">{plan.period}</span>}
                </div>
                <p className="text-[12px] text-muted mb-6">{plan.desc}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-muted">
                      <span className="text-rust mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {plan.note && (
                  <p className="text-[11px] text-muted mb-4 leading-relaxed">{plan.note}</p>
                )}

                <Link
                  href={plan.ctaHref}
                  className={`block text-center py-2 font-mono text-sm transition-colors ${
                    plan.ctaVariant === 'primary'
                      ? 'bg-rust text-bone hover:bg-rust_hover'
                      : 'border border-paper_border text-muted hover:text-ink hover:border-ink'
                  }`}
                  style={{ borderRadius: '2px' }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
