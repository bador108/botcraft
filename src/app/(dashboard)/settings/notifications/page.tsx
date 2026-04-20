'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

interface Notifications {
  limit_80: boolean
  limit_100: boolean
  weekly_summary: boolean
  failed_payment: boolean
  product_updates: boolean
}

const NOTIFICATION_ITEMS: { key: keyof Notifications; label: string; description: string }[] = [
  {
    key: 'limit_80',
    label: 'Limit na 80 %',
    description: 'Upozornění když dosáhneš 80 % měsíčního limitu zpráv',
  },
  {
    key: 'limit_100',
    label: 'Limit vyčerpán',
    description: 'Upozornění při vyčerpání měsíčního limitu',
  },
  {
    key: 'failed_payment',
    label: 'Neúspěšná platba',
    description: 'Pokud selže obnova předplatného',
  },
  {
    key: 'weekly_summary',
    label: 'Týdenní přehled',
    description: 'Statistiky použití za uplynulý týden',
  },
  {
    key: 'product_updates',
    label: 'Novinky produktu',
    description: 'Nové funkce a vylepšení BotCraft',
  },
]

export default function NotificationsSettings() {
  const [notifications, setNotifications] = useState<Notifications>({
    limit_80: true,
    limit_100: true,
    weekly_summary: true,
    failed_payment: true,
    product_updates: false,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/user/preferences')
      .then(r => r.json())
      .then(d => d?.email_notifications && setNotifications(d.email_notifications))
      .catch(() => {})
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email_notifications: notifications }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  function toggle(key: keyof Notifications) {
    setNotifications(p => ({ ...p, [key]: !p[key] }))
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">E-mailové notifikace</p>
          <p className="text-xs text-muted mt-0.5">Dostávej zprávy na svůj registrační email</p>
        </div>
        <div className="divide-y divide-paper_border">
          {NOTIFICATION_ITEMS.map(item => (
            <label
              key={item.key}
              className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-bone/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-ink">{item.label}</p>
                <p className="text-xs text-muted mt-0.5">{item.description}</p>
              </div>
              <div className="relative ml-4 shrink-0">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => toggle(item.key)}
                  className="sr-only"
                />
                <div className={`w-10 h-5.5 rounded-full transition-colors ${notifications[item.key] ? 'bg-rust' : 'bg-paper_border'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${notifications[item.key] ? 'translate-x-4.5' : ''}`} />
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" loading={saving}>
          Uložit
        </Button>
        {saved && (
          <span className="text-xs text-success font-mono flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Uloženo
          </span>
        )}
      </div>
    </form>
  )
}
