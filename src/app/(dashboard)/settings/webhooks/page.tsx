'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Webhook, Plus, Trash2, PlayCircle, Lock, CheckCircle2, XCircle } from 'lucide-react'

interface WebhookItem {
  id: string
  name: string
  url: string
  events: string[]
  enabled: boolean
  last_triggered_at: string | null
  last_status_code: number | null
  consecutive_failures: number
  created_at: string
}

interface Delivery {
  id: string
  event_type: string
  status_code: number
  succeeded: boolean
  duration_ms: number
  created_at: string
}

const EVENTS = [
  'message.created',
  'chatbot.updated',
  'document.uploaded',
  'document.deleted',
  'limit.reached',
]

export default function WebhooksPage() {
  const [hooks, setHooks] = useState<WebhookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [events, setEvents] = useState<string[]>(['message.created'])
  const [deliveries, setDeliveries] = useState<Record<string, Delivery[]>>({})
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/webhooks')
      .then(r => {
        if (r.status === 403) { setHasAccess(false); return [] }
        return r.json()
      })
      .then(data => setHooks(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  async function createWebhook() {
    setCreating(true)
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, events }),
      })
      if (res.status === 403) { setHasAccess(false); return }
      const data = await res.json()
      if (data.id) {
        setHooks(prev => [data, ...prev])
        setName('')
        setUrl('')
        setEvents(['message.created'])
      }
    } finally {
      setCreating(false)
    }
  }

  async function deleteWebhook(id: string) {
    await fetch(`/api/webhooks/${id}`, { method: 'DELETE' })
    setHooks(prev => prev.filter(h => h.id !== id))
  }

  async function toggleWebhook(id: string, enabled: boolean) {
    await fetch(`/api/webhooks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    })
    setHooks(prev => prev.map(h => h.id === id ? { ...h, enabled } : h))
  }

  async function testWebhook(id: string) {
    setTesting(id)
    try {
      await fetch(`/api/webhooks/${id}/test`, { method: 'POST' })
    } finally {
      setTesting(null)
    }
  }

  async function loadDeliveries(id: string) {
    if (expandedId === id) { setExpandedId(null); return }
    setExpandedId(id)
    if (!deliveries[id]) {
      const res = await fetch(`/api/webhooks/${id}/deliveries`)
      const data = await res.json()
      setDeliveries(prev => ({ ...prev, [id]: data }))
    }
  }

  if (!hasAccess) {
    return (
      <div className="bg-white rounded-xl border border-paper_border shadow-sm p-8 text-center">
        <Lock className="h-8 w-8 text-muted mx-auto mb-3" />
        <p className="text-sm font-medium text-ink">Webhooky jsou dostupné od plánu Studio</p>
        <p className="text-xs text-muted mt-1">Upgraduj plán pro přístup k webhookům.</p>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => window.location.href = '/billing'}>
          Upgrade
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create form */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5 space-y-4">
        <p className="text-sm font-semibold text-ink">Nový webhook</p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            placeholder="Název"
            value={name}
            onChange={e => setName(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="https://tvoje-api.cz/webhook"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {EVENTS.map(ev => (
            <label key={ev} className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={events.includes(ev)}
                onChange={e => setEvents(prev =>
                  e.target.checked ? [...prev, ev] : prev.filter(s => s !== ev)
                )}
                className="rounded"
              />
              {ev}
            </label>
          ))}
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={!name.trim() || !url.startsWith('https://') || !events.length || creating}
          onClick={createWebhook}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          {creating ? 'Vytváření...' : 'Vytvořit webhook'}
        </Button>
      </div>

      {/* Webhooks list */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Webhooky</p>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-center text-xs text-muted">Načítání...</div>
        ) : hooks.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Webhook className="h-6 w-6 text-muted mx-auto mb-2" />
            <p className="text-xs text-muted">Zatím žádné webhooky</p>
          </div>
        ) : (
          <ul className="divide-y divide-paper_border">
            {hooks.map(hook => (
              <li key={hook.id}>
                <div className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink truncate">{hook.name}</p>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          hook.enabled
                            ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                            : 'text-muted bg-paper border-paper_border'
                        }`}>
                          {hook.enabled ? 'aktivní' : 'neaktivní'}
                        </span>
                        {hook.consecutive_failures >= 3 && (
                          <span className="text-[10px] font-mono text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                            {hook.consecutive_failures}× selhání
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5 truncate">{hook.url}</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {hook.events.map(ev => (
                          <span key={ev} className="text-[10px] font-mono text-muted bg-paper border border-paper_border px-1.5 py-0.5 rounded">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => loadDeliveries(hook.id)}
                        className="text-xs text-muted"
                      >
                        Doručení
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => testWebhook(hook.id)}
                        disabled={testing === hook.id}
                        title="Test"
                      >
                        <PlayCircle className="h-3.5 w-3.5 text-muted" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleWebhook(hook.id, !hook.enabled)}
                        className="text-xs text-muted"
                      >
                        {hook.enabled ? 'Deaktivovat' : 'Aktivovat'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteWebhook(hook.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Deliveries panel */}
                {expandedId === hook.id && (
                  <div className="border-t border-paper_border bg-bone px-5 py-3">
                    <p className="text-xs font-medium text-muted mb-2">Posledních 50 doručení</p>
                    {!deliveries[hook.id] ? (
                      <p className="text-xs text-muted">Načítání...</p>
                    ) : deliveries[hook.id].length === 0 ? (
                      <p className="text-xs text-muted">Žádná doručení</p>
                    ) : (
                      <div className="space-y-1">
                        {deliveries[hook.id].map(d => (
                          <div key={d.id} className="flex items-center gap-3 text-xs">
                            {d.succeeded
                              ? <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                              : <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                            }
                            <span className="font-mono text-muted w-24 shrink-0">{d.event_type}</span>
                            <span className="text-muted w-12 shrink-0">{d.status_code || '—'}</span>
                            <span className="text-muted w-16 shrink-0">{d.duration_ms}ms</span>
                            <span className="text-muted">{new Date(d.created_at).toLocaleString('cs-CZ')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
