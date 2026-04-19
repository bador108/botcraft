'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

// Stripe price IDs zachovány (pro, business) — neměň bez aktualizace stripe/checkout/route.ts
const PLANS = [
  {
    id: 'free',
    displayName: 'Hobby',
    price: 0,
    features: [
      '1 chatbot',
      'Fast model (llama-3.1-8b)',
      '50 zpráv/měs',
      '1 dokument',
      '"Powered by BotCraft" badge',
    ],
  },
  {
    id: 'pro',
    displayName: 'Maker',
    price: 490,
    popular: true,
    features: [
      '5 chatbotů',
      'Fast + Balanced modely',
      '4 000 zpráv/měs',
      '20 dokumentů',
      'Plné RAG',
      'Custom branding, bez badge',
      'CSV export',
    ],
  },
  {
    id: 'business',
    displayName: 'Studio',
    price: 1290,
    features: [
      'Neomezeně chatbotů',
      'Všechny 3 modely',
      '15 000 zpráv/měs',
      'Custom doména',
      'Webhooky + A/B testing',
      'Team seats (3)',
      'White-label',
    ],
  },
]

// Normalizuje staré názvy plánů na nové pro zobrazení
function normalizePlan(p: string) {
  if (p === 'free' || p === 'hobby') return 'free'
  if (p === 'pro' || p === 'maker') return 'pro'
  if (p === 'business' || p === 'studio') return 'business'
  return p
}

export default function BillingPage() {
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    fetch('/api/user')
      .then(r => r.json())
      .then(d => setPlan(normalizePlan(d.plan ?? 'free')))
      .catch(() => {})
  }, [])

  async function subscribe(targetPlan: string) {
    setLoading(targetPlan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: targetPlan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-mono text-2xl font-medium text-ink uppercase tracking-tight">Fakturace</h1>
        <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
          Aktuální plán: {PLANS.find(p => p.id === plan)?.displayName ?? plan}
        </p>
      </div>

      {/* Notifikace */}
      {success && (
        <div className="flex items-center gap-3 p-4 border border-success bg-success/5 text-success text-sm font-mono" style={{ borderRadius: '2px' }}>
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Předplatné aktivováno. Tvůj plán byl upgradován.
        </div>
      )}
      {canceled && (
        <div className="p-4 border border-paper_border bg-paper text-muted text-sm font-mono" style={{ borderRadius: '2px' }}>
          Checkout byl zrušen. Žádné platby neproběhly.
        </div>
      )}

      {/* Plány — bez rounded, 1px borders, tabulkový styl */}
      <div className="border-t border-b border-paper_border">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-paper_border">
          {PLANS.map(p => (
            <div key={p.id} className="p-6 lg:p-8 flex flex-col relative">
              {p.popular && (
                <span className="font-mono text-[10px] text-rust uppercase tracking-wider mb-1">
                  Nejčastější volba
                </span>
              )}
              {!p.popular && <span className="h-[18px] mb-1" />}

              <p className="font-mono text-lg font-medium text-ink">{p.displayName}</p>
              <div className="flex items-baseline gap-1 mt-1 mb-0.5">
                <span className="font-mono text-2xl font-semibold text-ink">
                  {p.price === 0 ? '0 Kč' : `${p.price} Kč`}
                </span>
                {p.price > 0 && <span className="text-sm text-muted">/ měs</span>}
              </div>
              {p.price === 0 && <p className="font-mono text-[11px] text-muted mb-4">navždy</p>}

              <ul className="space-y-2 my-5 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-muted">
                    <span className="text-rust mt-0.5 shrink-0">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {plan === p.id ? (
                <div
                  className="w-full py-2 text-center font-mono text-sm text-muted border border-paper_border"
                  style={{ borderRadius: '2px' }}
                >
                  Aktuální plán
                </div>
              ) : p.id === 'free' ? (
                <div className="w-full py-2 text-center font-mono text-sm text-muted">
                  Downgrade není dostupný
                </div>
              ) : (
                <Button
                  className="w-full"
                  variant="primary"
                  loading={loading === p.id}
                  onClick={() => subscribe(p.id)}
                >
                  Přejít na {p.displayName}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="font-mono text-[11px] text-muted">
        Zrušit kdykoli · Žádná smlouva · Fakturace přes Stripe
      </p>
    </div>
  )
}
