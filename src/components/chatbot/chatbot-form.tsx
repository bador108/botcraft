'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Save, Trash2, Plus, X, Upload, Loader2 } from 'lucide-react'
import { MODEL_LABELS } from '@/lib/plans'
import { PRESET_AVATARS, getPresetAvatar, isImageUrl } from '@/lib/bot-avatars'
import type { Chatbot, ChatModel, Plan } from '@/types'

interface ChatbotFormProps {
  chatbot?: Chatbot
  plan: Plan
}

export function ChatbotForm({ chatbot, plan }: ChatbotFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [domainInput, setDomainInput] = useState('')
  const [questionInput, setQuestionInput] = useState('')
  const [avatarTab, setAvatarTab] = useState<'preset' | 'custom'>(() =>
    chatbot?.avatar && isImageUrl(chatbot.avatar) ? 'custom' : 'preset'
  )
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: chatbot?.name ?? '',
    avatar: chatbot?.avatar ?? 'bot-classic',
    system_prompt: chatbot?.system_prompt ?? 'You are a helpful assistant.',
    model: chatbot?.model ?? 'llama-3.1-8b-instant' as ChatModel,
    theme_color: chatbot?.theme_color ?? '#D4500A',
    welcome_message: chatbot?.welcome_message ?? 'Ahoj! Jak ti mohu pomoci?',
    allowed_domains: chatbot?.allowed_domains ?? [] as string[],
    suggested_questions: chatbot?.suggested_questions ?? [] as string[],
    is_active: chatbot?.is_active ?? true,
  })

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  // Přeloží preset ID na SVG pro zobrazení
  const currentPreset = getPresetAvatar(form.avatar)
  const isCustomImage = isImageUrl(form.avatar)

  const addDomain = () => {
    const d = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (d && !form.allowed_domains.includes(d)) {
      set('allowed_domains', [...form.allowed_domains, d])
      setDomainInput('')
    }
  }

  const removeDomain = (d: string) =>
    set('allowed_domains', form.allowed_domains.filter(x => x !== d))

  const addQuestion = () => {
    const q = questionInput.trim()
    if (q && !form.suggested_questions.includes(q)) {
      set('suggested_questions', [...form.suggested_questions, q])
      setQuestionInput('')
    }
  }

  const removeQuestion = (q: string) =>
    set('suggested_questions', form.suggested_questions.filter(x => x !== q))

  async function handleAvatarUpload(file: File) {
    if (!chatbot?.id) {
      alert('Nejdřív ulož chatbota, pak nahraj vlastní obrázek.')
      return
    }
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`/api/chatbots/${chatbot.id}/avatar`, { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) {
      setUploadError(data.error ?? 'Upload selhal')
      return
    }
    set('avatar', data.avatar)
  }

  // Pro uložení: preset ID se ukládá jako-je, image URL taky
  async function save() {
    setSaving(true)
    try {
      const url = chatbot ? `/api/chatbots/${chatbot.id}` : '/api/chatbots'
      const method = chatbot ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.error ?? 'Failed to save')
        return
      }
      const data = await res.json()
      router.push(`/chatbots/${data.id}`)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  async function deleteChatbot() {
    if (!chatbot) return
    if (!confirm('Smazat tohoto chatbota? Tuto akci nelze vrátit zpět.')) return
    setDeleting(true)
    try {
      await fetch(`/api/chatbots/${chatbot.id}`, { method: 'DELETE' })
      router.push('/chatbots')
    } finally {
      setDeleting(false)
    }
  }

  const allowedModels = plan === 'free' || plan === 'hobby'
    ? ['llama-3.1-8b-instant']
    : ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b']

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Basic */}
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-ink">Základní informace</h2>

        <Input label="Název chatbota" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Můj podpůrný bot" />

        {/* Avatar picker */}
        <div>
          <label className="text-sm font-medium text-ink mb-2 block">Avatar</label>

          {/* Preview */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-xl overflow-hidden flex items-center justify-center border border-paper_border bg-bone shrink-0">
              {currentPreset ? (
                <div className="h-10 w-10">{currentPreset.svg}</div>
              ) : isCustomImage ? (
                <Image src={form.avatar} alt="avatar" width={56} height={56} className="object-cover w-full h-full" unoptimized />
              ) : (
                <span className="text-2xl">{form.avatar}</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-ink">
                {currentPreset ? 'Preset ikona' : isCustomImage ? 'Vlastní obrázek' : 'Vlastní emoji'}
              </p>
              <p className="text-xs text-muted">Tuto ikonu uvidí uživatelé ve widgetu</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-paper_border mb-4">
            <button
              type="button"
              onClick={() => setAvatarTab('preset')}
              className={`px-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                avatarTab === 'preset' ? 'text-ink border-b-2 border-ink -mb-px' : 'text-muted hover:text-ink'
              }`}
            >
              Preset ikony
            </button>
            <button
              type="button"
              onClick={() => setAvatarTab('custom')}
              className={`px-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                avatarTab === 'custom' ? 'text-ink border-b-2 border-ink -mb-px' : 'text-muted hover:text-ink'
              }`}
            >
              Vlastní obrázek
            </button>
          </div>

          {avatarTab === 'preset' && (
            <div className="grid grid-cols-8 gap-2">
              {PRESET_AVATARS.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => set('avatar', preset.id)}
                  className={`h-11 w-11 rounded-lg p-1.5 border-2 transition-all ${
                    form.avatar === preset.id
                      ? 'border-rust scale-105 shadow-sm'
                      : 'border-paper_border hover:border-ink/30'
                  }`}
                >
                  {preset.svg}
                </button>
              ))}
            </div>
          )}

          {avatarTab === 'custom' && (
            <div className="space-y-3">
              {/* Drag & drop upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-paper_border rounded-lg p-6 text-center hover:border-ink/30 transition-colors group"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 text-muted animate-spin" />
                    <p className="text-sm text-muted">Nahrávám...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6 text-muted group-hover:text-ink transition-colors" />
                    <p className="text-sm font-medium text-ink">Klikni nebo přetáhni obrázek</p>
                    <p className="text-xs text-muted">PNG, JPG, WebP, SVG, ICO — max 512 KB</p>
                    <p className="text-xs text-muted">Ideální: čtvercové logo nebo favicon</p>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/x-icon"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                  e.target.value = ''
                }}
              />
              {uploadError && (
                <p className="text-xs text-red-500">{uploadError}</p>
              )}
              {!chatbot?.id && (
                <p className="text-xs text-amber-600">
                  Nejdřív ulož chatbota, pak se aktivuje upload vlastního obrázku.
                </p>
              )}
              {isCustomImage && (
                <div className="flex items-center gap-3 p-3 bg-bone rounded-lg border border-paper_border">
                  <Image src={form.avatar} alt="avatar" width={40} height={40} className="rounded-lg object-cover shrink-0" unoptimized />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink font-medium truncate">Vlastní obrázek nahrán</p>
                    <p className="text-[10px] text-muted truncate">{form.avatar}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set('avatar', 'bot-classic')}
                    className="text-muted hover:text-ink transition-colors shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-ink mb-2 block">Barva widgetu</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.theme_color}
              onChange={e => set('theme_color', e.target.value)}
              className="h-9 w-16 rounded-lg border border-paper_border cursor-pointer p-0.5 bg-white"
            />
            <span className="text-sm text-muted font-mono">{form.theme_color}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Aktivní</p>
            <p className="text-xs text-muted">Widget je viditelný na vložených stránkách</p>
          </div>
          <button
            type="button"
            onClick={() => set('is_active', !form.is_active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-rust' : 'bg-paper_border'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </Card>

      {/* AI Config */}
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-ink">Konfigurace AI</h2>

        <div>
          <label className="text-sm font-medium text-ink mb-2 block">Model</label>
          <div className="space-y-2">
            {(['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b'] as ChatModel[]).map(m => {
              const info = MODEL_LABELS[m]
              const available = allowedModels.includes(m)
              return (
                <button
                  key={m}
                  type="button"
                  disabled={!available}
                  onClick={() => available && set('model', m)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 text-left transition ${
                    form.model === m ? 'border-ink bg-bone' : 'border-paper_border'
                  } ${!available ? 'opacity-40 cursor-not-allowed' : 'hover:border-ink/40 cursor-pointer'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{info.label}</span>
                      <Badge variant={info.tier === 'Hobby' ? 'success' : 'purple'}>{info.tier}</Badge>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{info.description}</p>
                  </div>
                  {form.model === m && (
                    <div className="h-4 w-4 rounded-full bg-ink shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
          {(plan === 'free' || plan === 'hobby') && (
            <p className="text-xs text-amber-600 mt-2">
              Upgrade na Maker pro odemčení dalších modelů
            </p>
          )}
        </div>

        <Textarea
          label="Systémový prompt"
          value={form.system_prompt}
          onChange={e => set('system_prompt', e.target.value)}
          rows={5}
          placeholder="Jsi užitečný zákaznický asistent firmy Acme..."
        />

        <Input
          label="Uvítací zpráva"
          value={form.welcome_message}
          onChange={e => set('welcome_message', e.target.value)}
          placeholder="Ahoj! Jak ti mohu pomoci?"
        />
      </Card>

      {/* Suggested questions */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-ink">Navrhované otázky</h2>
          <p className="text-xs text-muted mt-0.5">
            Tlačítka zobrazená uživateli po uvítací zprávě. Kliknutím odešlou otázku přímo.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={questionInput}
            onChange={e => setQuestionInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addQuestion())}
            placeholder="Jak mohu sledovat stav objednávky?"
            className="flex-1"
          />
          <Button variant="secondary" size="sm" onClick={addQuestion} type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {form.suggested_questions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.suggested_questions.map(q => (
              <span key={q} className="flex items-center gap-1 bg-bone text-ink text-xs px-2.5 py-1 rounded-full border border-paper_border max-w-full">
                <span className="truncate max-w-[240px]">{q}</span>
                <button type="button" onClick={() => removeQuestion(q)} className="shrink-0">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Security */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-ink">Povolené domény</h2>
          <p className="text-xs text-muted mt-0.5">
            Ponech prázdné pro všechny domény. Přidej konkrétní domény pro omezení vložení.
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={domainInput}
            onChange={e => setDomainInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDomain())}
            placeholder="example.com"
            className="flex-1"
          />
          <Button variant="secondary" size="sm" onClick={addDomain} type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {form.allowed_domains.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {form.allowed_domains.map(d => (
              <span key={d} className="flex items-center gap-1 bg-bone text-ink text-xs px-2.5 py-1 rounded-full border border-paper_border">
                {d}
                <button type="button" onClick={() => removeDomain(d)}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button onClick={save} loading={saving}>
          <Save className="h-4 w-4" />
          {chatbot ? 'Uložit změny' : 'Vytvořit chatbota'}
        </Button>
        {chatbot && (
          <Button variant="danger" size="sm" onClick={deleteChatbot} loading={deleting}>
            <Trash2 className="h-4 w-4" />
            Smazat
          </Button>
        )}
      </div>
    </div>
  )
}
