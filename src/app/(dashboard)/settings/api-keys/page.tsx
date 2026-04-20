'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Key, Copy, Trash2, Plus, Lock } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  scopes: string[]
  last_used_at: string | null
  revoked_at: string | null
  created_at: string
}

const AVAILABLE_EVENTS = ['read', 'write']

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newScopes, setNewScopes] = useState<string[]>(['read'])
  const [newKeyFull, setNewKeyFull] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/api-keys')
      .then(r => {
        if (r.status === 403) { setHasAccess(false); return [] }
        return r.json()
      })
      .then(data => setKeys(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  async function createKey() {
    setCreating(true)
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, scopes: newScopes }),
      })
      if (res.status === 403) { setHasAccess(false); return }
      const data = await res.json()
      if (data.fullKey) {
        setNewKeyFull(data.fullKey)
        setKeys(prev => [data, ...prev])
        setNewName('')
        setNewScopes(['read'])
      }
    } finally {
      setCreating(false)
    }
  }

  async function revokeKey(id: string) {
    await fetch(`/api/api-keys/${id}`, { method: 'DELETE' })
    setKeys(prev => prev.map(k => k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k))
  }

  function copyKey() {
    if (!newKeyFull) return
    navigator.clipboard.writeText(newKeyFull)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!hasAccess) {
    return (
      <div className="bg-white rounded-xl border border-paper_border shadow-sm p-8 text-center">
        <Lock className="h-8 w-8 text-muted mx-auto mb-3" />
        <p className="text-sm font-medium text-ink">API klíče jsou dostupné od plánu Studio</p>
        <p className="text-xs text-muted mt-1">Upgraduj plán pro přístup k REST API.</p>
        <Button variant="primary" size="sm" className="mt-4" onClick={() => window.location.href = '/billing'}>
          Upgrade
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* New key created */}
      {newKeyFull && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
          <p className="text-sm font-medium text-emerald-800">Klíč vytvořen — ulož ho teď, nezobrazí se znovu</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono bg-white border border-emerald-200 rounded-lg px-3 py-2 text-emerald-900 overflow-auto">
              {newKeyFull}
            </code>
            <Button variant="secondary" size="sm" onClick={copyKey}>
              {copied ? 'Zkopírováno' : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <button className="text-xs text-emerald-700 underline" onClick={() => setNewKeyFull(null)}>
            Zavřít
          </button>
        </div>
      )}

      {/* Create form */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm p-5 space-y-4">
        <p className="text-sm font-semibold text-ink">Nový API klíč</p>
        <div className="flex gap-3">
          <Input
            placeholder="Název klíče"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="max-w-xs text-sm"
          />
          <div className="flex items-center gap-3">
            {AVAILABLE_EVENTS.map(scope => (
              <label key={scope} className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={newScopes.includes(scope)}
                  onChange={e => setNewScopes(prev =>
                    e.target.checked ? [...prev, scope] : prev.filter(s => s !== scope)
                  )}
                  className="rounded"
                />
                {scope}
              </label>
            ))}
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={!newName.trim() || creating}
            onClick={createKey}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            {creating ? 'Vytváření...' : 'Vytvořit'}
          </Button>
        </div>
      </div>

      {/* Keys list */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">API klíče</p>
        </div>
        {loading ? (
          <div className="px-5 py-8 text-center text-xs text-muted">Načítání...</div>
        ) : keys.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Key className="h-6 w-6 text-muted mx-auto mb-2" />
            <p className="text-xs text-muted">Zatím žádné API klíče</p>
          </div>
        ) : (
          <ul className="divide-y divide-paper_border">
            {keys.map(key => (
              <li key={key.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-ink truncate">{key.name}</p>
                    {key.revoked_at && (
                      <span className="text-[10px] font-mono text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                        revokován
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <code className="text-xs font-mono text-muted">{key.key_prefix}</code>
                    <span className="text-xs text-muted">
                      {key.scopes.join(', ')}
                    </span>
                    {key.last_used_at && (
                      <span className="text-xs text-muted">
                        naposledy {new Date(key.last_used_at).toLocaleDateString('cs-CZ')}
                      </span>
                    )}
                  </div>
                </div>
                {!key.revoked_at && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeKey(key.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
