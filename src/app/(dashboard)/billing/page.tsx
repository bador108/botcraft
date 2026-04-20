'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ExternalLink, Download, AlertCircle } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    displayName: 'Hobby',
    price: 0,
    features: [
      '1 chatbot',
      'Fast model',
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

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('cs-CZ')
}

interface Invoice {
  id: string
  amount_cents: number
  currency: string
  status: string
  invoice_pdf: string | null
  paid_at: string | null
  period_start: string | null
  period_end: string | null
  created_at: string
}

interface BillingInfo {
  company_name?: string
  ico?: string
  dic?: string
  address_line1?: string
  address_line2?: string
  city?: string
  postal_code?: string
  country?: string
  invoice_email?: string
}

export default function BillingPage() {
  const [plan, setPlan] = useState('free')
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({})
  const [savingBilling, setSavingBilling] = useState(false)
  const [billingSaved, setBillingSaved] = useState(false)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(d => setPlan(normalizePlan(d.plan ?? 'free'))).catch(() => {})
    fetch('/api/invoices').then(r => r.json()).then(d => Array.isArray(d) && setInvoices(d)).catch(() => {})
    fetch('/api/billing-info').then(r => r.json()).then(d => d && !d.error && setBillingInfo(d)).catch(() => {})
  }, [])

  async function subscribe(targetPlan: string) {
    setLoadingCheckout(targetPlan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: targetPlan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoadingCheckout(null)
    }
  }

  async function openPortal() {
    setLoadingPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoadingPortal(false)
    }
  }

  async function saveBillingInfo(e: React.FormEvent) {
    e.preventDefault()
    setSavingBilling(true)
    try {
      await fetch('/api/billing-info', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billingInfo),
      })
      setBillingSaved(true)
      setTimeout(() => setBillingSaved(false), 3000)
    } finally {
      setSavingBilling(false)
    }
  }

  const currentPlan = PLANS.find(p => p.id === plan)
  const isPaid = plan !== 'free'

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Fakturace</h1>
          <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">
            Aktuální plán: {currentPlan?.displayName ?? plan}
          </p>
        </div>
        {isPaid && (
          <Button variant="secondary" loading={loadingPortal} onClick={openPortal}>
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Spravovat platby
          </Button>
        )}
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

      {/* Plány */}
      <div>
        <h2 className="text-sm font-semibold text-ink mb-4">Plány</h2>
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
                    {isPaid ? 'Downgrade přes portál' : '—'}
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    variant="primary"
                    loading={loadingCheckout === p.id}
                    onClick={() => subscribe(p.id)}
                  >
                    Přejít na {p.displayName}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="font-mono text-[11px] text-muted mt-3">
          Zrušit kdykoli · Žádná smlouva · Fakturace přes Stripe
        </p>
      </div>

      {/* Fakturační údaje */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Fakturační údaje</p>
          <p className="text-xs text-muted mt-0.5">Propíšou se do faktur generovaných Stripem</p>
        </div>
        <form onSubmit={saveBillingInfo} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Název firmy</label>
              <input
                type="text"
                value={billingInfo.company_name ?? ''}
                onChange={e => setBillingInfo(p => ({ ...p, company_name: e.target.value }))}
                placeholder="Acme s.r.o."
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email pro faktury</label>
              <input
                type="email"
                value={billingInfo.invoice_email ?? ''}
                onChange={e => setBillingInfo(p => ({ ...p, invoice_email: e.target.value }))}
                placeholder="faktury@firma.cz"
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">IČO</label>
              <input
                type="text"
                value={billingInfo.ico ?? ''}
                onChange={e => setBillingInfo(p => ({ ...p, ico: e.target.value }))}
                placeholder="12345678"
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">DIČ</label>
              <input
                type="text"
                value={billingInfo.dic ?? ''}
                onChange={e => setBillingInfo(p => ({ ...p, dic: e.target.value }))}
                placeholder="CZ12345678"
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted mb-1">Ulice a číslo</label>
              <input
                type="text"
                value={billingInfo.address_line1 ?? ''}
                onChange={e => setBillingInfo(p => ({ ...p, address_line1: e.target.value }))}
                placeholder="Václavské nám. 1"
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Město</label>
              <input
                type="text"
                value={billingInfo.city ?? ''}
                onChange={e => setBillingInfo(p => ({ ...p, city: e.target.value }))}
                placeholder="Praha"
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">PSČ</label>
              <input
                type="text"
                value={billingInfo.postal_code ?? ''}
                onChange={e => setBillingInfo(p => ({ ...p, postal_code: e.target.value }))}
                placeholder="110 00"
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="primary" loading={savingBilling}>
              Uložit
            </Button>
            {billingSaved && (
              <span className="text-xs text-success font-mono flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Uloženo
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Faktury */}
      <div>
        <h2 className="text-sm font-semibold text-ink mb-4">Historie faktur</h2>
        {invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-paper_border border-dashed px-6 py-10 text-center">
            <AlertCircle className="h-8 w-8 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">Zatím žádné faktury</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-paper_border bg-paper">
                  <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Datum</th>
                  <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Částka</th>
                  <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Období</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-paper_border">
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="px-5 py-3.5 text-ink font-mono text-xs">
                      {formatDate(inv.paid_at ?? inv.created_at)}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-ink">
                      {formatAmount(inv.amount_cents, inv.currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                        inv.status === 'paid'
                          ? 'bg-success/10 text-success'
                          : inv.status === 'open'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-paper text-muted'
                      }`}>
                        {inv.status === 'paid' ? 'Zaplaceno' : inv.status === 'open' ? 'Čeká' : inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-muted text-xs font-mono">
                      {inv.period_start && inv.period_end
                        ? `${formatDate(inv.period_start)} – ${formatDate(inv.period_end)}`
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {inv.invoice_pdf && (
                        <a
                          href={inv.invoice_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
