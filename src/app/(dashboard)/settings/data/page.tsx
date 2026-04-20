'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, CheckCircle2 } from 'lucide-react'

const RETENTION_OPTIONS = [
  { value: 0, label: 'Navždy' },
  { value: 30, label: '30 dní' },
  { value: 60, label: '60 dní' },
  { value: 90, label: '90 dní' },
  { value: 365, label: '1 rok' },
]

export default function DataSettings() {
  const [retention, setRetention] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportUrl, setExportUrl] = useState<string | null>(null)
  const [exportError, setExportError] = useState('')

  useEffect(() => {
    fetch('/api/user/preferences').then(r => r.json()).then(d => {
      if (d?.data_retention_days != null) setRetention(d.data_retention_days)
    }).catch(() => {})
  }, [])

  async function saveRetention() {
    setSaving(true)
    try {
      await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data_retention_days: retention }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  async function requestExport() {
    setExporting(true)
    setExportError('')
    setExportUrl(null)
    try {
      const res = await fetch('/api/user/export', { method: 'POST' })
      const data = await res.json()
      if (data.downloadUrl) {
        setExportUrl(data.downloadUrl)
      } else {
        setExportError(data.error ?? 'Export selhal')
      }
    } catch {
      setExportError('Připojení selhalo')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Export dat (GDPR čl. 20)</p>
          <p className="text-xs text-muted mt-0.5">Stáhni všechna svá data jako ZIP archiv</p>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-muted">
            Archiv obsahuje: profil, chatboty, dokumenty, konverzace, faktury. Odkaz platný 7 dní.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="secondary" loading={exporting} onClick={requestExport}>
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Generovat export
            </Button>
            {exportUrl && (
              <a href={exportUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-rust hover:underline font-medium">
                Stáhnout ZIP
              </a>
            )}
            {exportError && <span className="text-xs text-red-500">{exportError}</span>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Automatické mazání konverzací</p>
          <p className="text-xs text-muted mt-0.5">Konverzace starší než limit budou automaticky smazány</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Mazat konverzace starší než</label>
            <select
              value={retention}
              onChange={e => setRetention(Number(e.target.value))}
              className="px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
            >
              {RETENTION_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" loading={saving} onClick={saveRetention}>Uložit</Button>
            {saved && (
              <span className="text-xs text-success font-mono flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Uloženo
              </span>
            )}
          </div>
          {retention > 0 && (
            <p className="text-xs text-muted font-mono border border-paper_border rounded-md px-3 py-2">
              Mazání probíhá denně ve 3:00 UTC. Nelze obnovit.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Smazání účtu</p>
        </div>
        <div className="p-5">
          <p className="text-sm text-muted">
            Kontaktuj{' '}
            <a href="mailto:support@botcraft.app" className="text-ink hover:underline">support@botcraft.app</a>
            {' '}— GDPR čl. 17, zpracujeme do 30 dní.
          </p>
        </div>
      </div>
    </div>
  )
}
