'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Upload, FileText, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Document, Plan } from '@/types'
import { PLAN_LIMITS } from '@/lib/plans'

interface KnowledgeBaseProps {
  chatbotId: string
  initialDocuments: Document[]
  plan: Plan
}

export function KnowledgeBase({ chatbotId, initialDocuments, plan }: KnowledgeBaseProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments)
  const [uploading, setUploading] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [pasteName, setPasteName] = useState('')
  const [pasting, setPasting] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'upload' | 'paste'>('upload')

  const limits = PLAN_LIMITS[plan]
  const totalChunks = documents.reduce((s, d) => s + d.chunk_count, 0)
  const canUpload = limits.documents_per_chatbot === Infinity || documents.length < limits.documents_per_chatbot

  const onDrop = useCallback(async (files: File[]) => {
    if (!canUpload) { setError('Limit dokumentů dosažen. Upgraduj pro více.'); return }
    const file = files[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('chatbotId', chatbotId)
      const res = await fetch('/api/documents', { method: 'POST', body: fd })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        setError(e.error ?? 'Upload selhal')
        return
      }
      const doc = await res.json()
      setDocuments(prev => [doc, ...prev])
    } finally {
      setUploading(false)
    }
  }, [chatbotId, canUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    maxFiles: 1,
    disabled: uploading || !canUpload,
  })

  async function pasteRawText() {
    if (!pasteText.trim() || !pasteName.trim()) return
    if (!canUpload) { setError('Limit dokumentů dosažen. Upgraduj pro více.'); return }
    setPasting(true)
    setError('')
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatbotId, text: pasteText, name: pasteName }),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        setError(e.error ?? 'Přidání textu selhalo')
        return
      }
      const doc = await res.json()
      setDocuments(prev => [doc, ...prev])
      setPasteText('')
      setPasteName('')
    } finally {
      setPasting(false)
    }
  }

  async function deleteDocument(id: string) {
    if (!confirm('Smazat tento dokument a všechny jeho chunky?')) return
    await fetch(`/api/documents/${id}`, { method: 'DELETE' })
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-muted">
          <strong className="text-ink">{documents.length}</strong>
          {limits.documents_per_chatbot !== Infinity ? ` / ${limits.documents_per_chatbot}` : ''} dokumentů
        </span>
        <span className="text-muted">
          <strong className="text-ink">{totalChunks}</strong>
          {limits.chunks_per_chatbot !== Infinity ? ` / ${limits.chunks_per_chatbot}` : ''} chunků
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-600 text-sm border border-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Upload tabs */}
      <Card className="p-6 space-y-4">
        <div className="flex border-b border-paper_border gap-4">
          {(['upload', 'paste'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium border-b-2 transition -mb-px ${
                tab === t
                  ? 'border-ink text-ink'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {t === 'upload' ? 'Nahrát soubor' : 'Vložit text'}
            </button>
          ))}
        </div>

        {tab === 'upload' ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 md:p-10 text-center cursor-pointer transition ${
              isDragActive
                ? 'border-rust bg-rust/5'
                : !canUpload
                ? 'border-paper_border opacity-50 cursor-not-allowed'
                : 'border-paper_border hover:border-ink/30 hover:bg-bone'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="h-8 w-8 text-rust animate-spin mx-auto mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-muted mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-ink">
              {uploading ? 'Zpracovávám...' : isDragActive ? 'Pusť soubor zde' : 'Přetáhni nebo klikni pro nahrání'}
            </p>
            <p className="text-xs text-muted mt-1">PDF, TXT, MD — max 10 MB</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={pasteName}
              onChange={e => setPasteName(e.target.value)}
              placeholder="Název dokumentu (např. FAQ)"
              className="w-full rounded-lg border border-paper_border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
            />
            <Textarea
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              placeholder="Vlož obsah textu zde..."
              rows={8}
            />
            <Button onClick={pasteRawText} loading={pasting} disabled={!pasteText.trim() || !pasteName.trim()}>
              Přidat do znalostní báze
            </Button>
          </div>
        )}
      </Card>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">Dokumenty</h3>
          {documents.map(doc => (
            <Card key={doc.id} className="px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-rust shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{doc.name}</p>
                  <p className="text-xs text-muted">{doc.chunk_count} chunků · {formatDate(doc.created_at)}</p>
                </div>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-muted hover:text-red-500 transition-colors rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!canUpload && (
        <p className="text-xs text-amber-600 text-center">
          Limit dokumentů dosažen.{' '}
          <a href="/billing" className="underline hover:text-amber-700">Upgraduj</a> pro více.
        </p>
      )}
    </div>
  )
}
