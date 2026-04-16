'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['1 chatbot', 'Basic model (Llama 8B)', '100 messages/month', '1 document per bot', '50 chunks'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 250,
    features: ['5 chatbots', 'All models (incl. 70B)', '2000 messages/month', '20 documents per bot', 'Unlimited chunks'],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 750,
    features: ['Unlimited chatbots', 'All models', 'Unlimited messages', 'Unlimited documents', 'Priority support'],
  },
]

export default function BillingPage() {
  const [plan, setPlan] = useState('free')
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(d => setPlan(d.plan ?? 'free')).catch(() => {})
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Current plan: <span className="font-semibold capitalize text-indigo-600">{plan}</span>
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm font-medium">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Subscription activated! Your plan has been upgraded.
        </div>
      )}

      {canceled && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
          Checkout was canceled. No charges were made.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map(p => (
          <div key={p.id} className={`relative rounded-2xl border-2 p-6 ${
            p.popular
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
          }`}>
            {p.popular && (
              <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <div className="mb-4">
              <p className="font-bold text-lg text-gray-900 dark:text-white">{p.name}</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{p.price === 0 ? 'Zdarma' : `${p.price} Kč`}</span>
                {p.price > 0 && <span className="text-gray-400 text-sm">/měs.</span>}
              </div>
            </div>

            <ul className="space-y-2.5 mb-6">
              {p.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            {plan === p.id ? (
              <div className="w-full py-2 text-center text-sm font-medium text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl">
                Current Plan
              </div>
            ) : p.id === 'free' ? (
              <div className="w-full py-2 text-center text-sm font-medium text-gray-400">
                Downgrade not available
              </div>
            ) : (
              <Button
                className="w-full"
                variant={p.popular ? 'primary' : 'secondary'}
                loading={loading === p.id}
                onClick={() => subscribe(p.id)}
              >
                <Zap className="h-4 w-4" />
                Přejít na {p.name}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
