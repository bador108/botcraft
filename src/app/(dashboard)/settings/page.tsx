'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

const TIMEZONES = [
  { value: 'Europe/Prague', label: 'Praha (CET/CEST)' },
  { value: 'Europe/London', label: 'Londýn (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Berlín (CET/CEST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'Asia/Tokyo', label: 'Tokio (JST)' },
  { value: 'UTC', label: 'UTC' },
]

interface UserData {
  email: string
  full_name: string
  plan: string
  created_at: string
}

interface Prefs {
  timezone: string
  language: string
}

export default function ProfileSettings() {
  const [user, setUser] = useState<UserData | null>(null)
  const [prefs, setPrefs] = useState<Prefs>({ timezone: 'Europe/Prague', language: 'cs' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(d => d && !d.error && setUser(d)).catch(() => {})
    fetch('/api/user/preferences').then(r => r.json()).then(d => d && !d.error && setPrefs(d)).catch(() => {})
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Účet */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Účet</p>
        </div>
        <div className="divide-y divide-paper_border">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted">E-mail</span>
            <span className="text-sm font-medium text-ink">{user?.email ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted">Plán</span>
            <span className="text-sm font-medium text-ink capitalize">{user?.plan ?? 'Hobby'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-muted">Člen od</span>
            <span className="text-sm font-medium text-ink">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('cs-CZ')
                : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Preference */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Preference</p>
        </div>
        <form onSubmit={save} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Časová zóna</label>
              <select
                value={prefs.timezone}
                onChange={e => setPrefs(p => ({ ...p, timezone: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Jazyk rozhraní</label>
              <select
                value={prefs.language}
                onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
              >
                <option value="cs">Čeština</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
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
      </div>
    </div>
  )
}
