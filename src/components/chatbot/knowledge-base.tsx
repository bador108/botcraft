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
    if (!canUpload) { setError('Document limit reached. Upgrade to add more.'); return }
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
        setError(e.error ?? 'Upload failed')
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
    if (!canUpload) { setError('Document limit reached. Upgrade to add more.'); return }
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
        setError(e.error ?? 'Failed to add text')
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
    if (!confirm('Delete this document and all its chunks?')) return
    await fetch(`/api/documents/${id}`, { method: 'DELETE' })
    setDocuments(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">{documents.length}</strong>
          {limits.documents_per_chatbot !== Infinity ? ` / ${limits.documents_per_chatbot}` : ''} documents
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">{totalChunks}</strong>
          {limits.chunks_per_chatbot !== Infinity ? ` / ${limits.chunks_per_chatbot}` : ''} chunks
        </span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Upload tabs */}
      <Card className="p-6 space-y-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700 gap-4">
          {(['upload', 'paste'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium border-b-2 transition -mb-px ${
                tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t === 'upload' ? 'Upload File' : 'Paste Text'}
            </button>
          ))}
        </div>

        {tab === 'upload' ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-6 md:p-10 text-center cursor-pointer transition ${
              isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10' :
              !canUpload ? 'border-gray-200 opacity-50 cursor-not-allowed' :
              'border-gray-200 dark:border-gray-700 hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto mb-2" />
            ) : (
              <Upload className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            )}
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {uploading ? 'Processing...' : isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-gray-400 mt-1">PDF, TXT, MD — max 10MB</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={pasteName}
              onChange={e => setPasteName(e.target.value)}
              placeholder="Document name (e.g. FAQ)"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Textarea
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              placeholder="Paste your text content here..."
              rows={8}
            />
            <Button onClick={pasteRawText} loading={pasting} disabled={!pasteText.trim() || !pasteName.trim()}>
              Add to Knowledge Base
            </Button>
          </div>
        )}
      </Card>

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Documents</h3>
          {documents.map(doc => (
            <Card key={doc.id} className="px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.chunk_count} chunks · {formatDate(doc.created_at)}</p>
                </div>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!canUpload && (
        <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
          Document limit reached.{' '}
          <a href="/billing" className="underline">Upgrade</a> to add more.
        </p>
      )}
    </div>
  )
}
