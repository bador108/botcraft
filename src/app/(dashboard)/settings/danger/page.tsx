'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertTriangle } from 'lucide-react'

export default function DangerSettings() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [deleteAfter, setDeleteAfter] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: input }),
      })
      const json = await res.json()
      if (res.ok) {
        setScheduled(true)
        setDeleteAfter(json.deleteAfter)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    setCancelling(true)
    try {
      await fetch('/api/user/delete', { method: 'DELETE' })
      setScheduled(false)
      setDeleteAfter(null)
      setInput('')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-sm font-semibold text-red-700">Nebezpečná zóna</p>
          </div>
          <p className="text-xs text-red-500 mt-0.5">Tyto akce jsou nevratné</p>
        </div>

        <div className="px-5 py-5 space-y-5">
          {scheduled ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                <p className="text-sm font-medium text-amber-800">Smazání naplánováno</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Účet bude smazán {deleteAfter ? new Date(deleteAfter).toLocaleDateString('cs-CZ') : 'za 30 dní'}.
                  Do té doby můžeš akci zrušit.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Rušení...' : 'Zrušit smazání'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-ink">Smazat účet</p>
                <p className="text-xs text-muted mt-0.5">
                  Naplánuje nenávratné smazání všech dat — chatbotů, dokumentů, konverzací.
                  Předplatné se zruší. Máš 30 dní na rozmyšlenou.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-muted">
                  Pro potvrzení napiš: <span className="font-mono text-ink">smazat můj účet</span>
                </p>
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="smazat můj účet"
                  className="max-w-xs text-sm"
                />
              </div>
              <Button
                variant="danger"
                size="sm"
                disabled={input !== 'smazat můj účet' || loading}
                onClick={handleDelete}
              >
                {loading ? 'Naplánování...' : 'Smazat účet'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
