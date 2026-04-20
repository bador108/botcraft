'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import {
  FileText, Upload, Trash2, Loader2, AlertCircle, Search, CheckCircle2,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Chatbot {
  id: string
  name: string
}

interface Document {
  id: string
  name: string
  file_type: string | null
  file_size_bytes: number | null
  status: string
  chunk_count: number
  created_at: string
  chatbots: { id: string; name: string } | null
}

function formatBytes(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'ready') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-success/10 text-success">
        <CheckCircle2 className="h-3 w-3" /> Zpracováno
      </span>
    )
  }
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rust/10 text-rust">
        <Loader2 className="h-3 w-3 animate-spin" /> Zpracovává se
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-red-50 text-red-600">
        <AlertCircle className="h-3 w-3" /> Chyba
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-paper text-muted">
      Čeká
    </span>
  )
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [selectedChatbot, setSelectedChatbot] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [search, setSearch] = useState('')
  const [filterChatbot, setFilterChatbot] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/documents').then(r => r.json()),
      fetch('/api/chatbots').then(r => r.json()),
    ]).then(([docs, bots]) => {
      if (Array.isArray(docs)) setDocuments(docs)
      if (Array.isArray(bots)) {
        setChatbots(bots)
        if (bots.length > 0) setSelectedChatbot(bots[0].id)
      }
    }).finally(() => setLoading(false))
  }, [])

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    if (!selectedChatbot) {
      setUploadError('Vyber nejdřív chatbota.')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadProgress(10)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('chatbotId', selectedChatbot)

      setUploadProgress(40)
      const res = await fetch('/api/documents', { method: 'POST', body: fd })
      setUploadProgress(90)

      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        setUploadError(e.error ?? 'Upload selhal')
        return
      }

      const doc = await res.json()
      setDocuments(prev => [doc, ...prev])
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1500)
    } catch {
      setUploadError('Připojení selhalo. Zkus znovu.')
    } finally {
      setUploading(false)
    }
  }, [selectedChatbot])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  async function deleteDocument(id: string) {
    if (!confirm('Smazat dokument? Tato akce je nevratná a odstraní i embeddingy.')) return
    setDeletingId(id)
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      setDocuments(prev => prev.filter(d => d.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = documents.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase())
    const matchBot = !filterChatbot || d.chatbots?.id === filterChatbot
    return matchSearch && matchBot
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Dokumenty</h1>
        <p className="text-sm text-muted mt-0.5">Knowledge base pro tvoje chatboty — PDF, TXT, Markdown, DOCX</p>
      </div>

      {/* Upload zona */}
      <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-paper_border">
          <p className="text-sm font-semibold text-ink">Nahrát dokument</p>
        </div>
        <div className="p-5 space-y-3">
          {/* Chatbot selector */}
          {chatbots.length > 0 && (
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-muted shrink-0">Přiřadit chatbotu</label>
              <select
                value={selectedChatbot}
                onChange={e => setSelectedChatbot(e.target.value)}
                className="px-3 py-1.5 text-sm border border-paper_border rounded-md bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
              >
                {chatbots.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}
          {chatbots.length === 0 && !loading && (
            <p className="text-xs text-muted">Nejdřív si vytvoř chatbota, pak sem nahraj dokumenty.</p>
          )}

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-rust bg-rust/5'
                : 'border-paper_border hover:border-ink/30 hover:bg-bone/50'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className={`h-8 w-8 mx-auto mb-3 ${isDragActive ? 'text-rust' : 'text-muted'}`} />
            {isDragActive ? (
              <p className="text-sm font-medium text-ink">Pusť soubor sem…</p>
            ) : (
              <>
                <p className="text-sm font-medium text-ink mb-1">
                  Přetáhni soubor nebo <span className="text-rust">klikni pro výběr</span>
                </p>
                <p className="text-xs text-muted">PDF, TXT, MD, DOCX · max 10 MB</p>
              </>
            )}
          </div>

          {/* Progress bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="h-1.5 rounded-full bg-paper overflow-hidden">
              <div
                className="h-full bg-rust transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          {uploadProgress === 100 && (
            <div className="flex items-center gap-2 text-xs text-success font-mono">
              <CheckCircle2 className="h-3.5 w-3.5" /> Nahráno
            </div>
          )}
          {uploadError && (
            <div className="flex items-center gap-2 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {uploadError}
            </div>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Hledat dokumenty…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-ink/20"
          />
        </div>
        {chatbots.length > 0 && (
          <select
            value={filterChatbot}
            onChange={e => setFilterChatbot(e.target.value)}
            className="px-3 py-2 text-sm border border-paper_border rounded-md bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/20"
          >
            <option value="">Všichni chatboti</option>
            {chatbots.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
        <span className="text-xs text-muted font-mono ml-auto">
          {filtered.length} {filtered.length === 1 ? 'dokument' : 'dokumentů'}
        </span>
      </div>

      {/* Documents table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-paper_border border-dashed px-6 py-14 text-center">
          <FileText className="h-10 w-10 text-muted mx-auto mb-4" />
          <p className="font-semibold text-ink mb-1">
            {documents.length === 0 ? 'Zatím žádné dokumenty' : 'Nic nenalezeno'}
          </p>
          <p className="text-sm text-muted">
            {documents.length === 0
              ? 'Nahraj první dokument výše.'
              : 'Zkus jiný filtr nebo vyhledávání.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-paper_border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-paper_border bg-paper">
                <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Název</th>
                <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Typ</th>
                <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Velikost</th>
                <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Chatbot</th>
                <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-mono text-muted uppercase tracking-wider">Nahráno</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-paper_border">
              {filtered.map(doc => (
                <tr key={doc.id} className="hover:bg-bone/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-muted shrink-0" />
                      <span className="font-medium text-ink text-sm truncate max-w-[200px]" title={doc.name}>
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-muted uppercase">
                      {doc.file_type ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted font-mono">
                    {formatBytes(doc.file_size_bytes)}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted">
                    {doc.chatbots?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted font-mono">
                    {formatDate(doc.created_at)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      disabled={deletingId === doc.id}
                      className="p-1.5 rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Smazat"
                    >
                      {deletingId === doc.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Trash2 className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
