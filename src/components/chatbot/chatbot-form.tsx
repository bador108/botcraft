'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Save, Trash2, Plus, X } from 'lucide-react'
import { MODEL_LABELS } from '@/lib/plans'
import type { Chatbot, ChatModel, Plan } from '@/types'

const EMOJI_OPTIONS = ['🤖', '💬', '🧠', '⚡', '🎯', '🌟', '🦾', '👾', '🎓', '🛠️']

interface ChatbotFormProps {
  chatbot?: Chatbot
  plan: Plan
}

export function ChatbotForm({ chatbot, plan }: ChatbotFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [domainInput, setDomainInput] = useState('')

  const [form, setForm] = useState({
    name: chatbot?.name ?? '',
    avatar: chatbot?.avatar ?? '🤖',
    system_prompt: chatbot?.system_prompt ?? 'You are a helpful assistant.',
    model: chatbot?.model ?? 'llama-3.1-8b-instant' as ChatModel,
    theme_color: chatbot?.theme_color ?? '#6366f1',
    welcome_message: chatbot?.welcome_message ?? 'Hi! How can I help you today?',
    allowed_domains: chatbot?.allowed_domains ?? [] as string[],
    is_active: chatbot?.is_active ?? true,
  })

  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const addDomain = () => {
    const d = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (d && !form.allowed_domains.includes(d)) {
      set('allowed_domains', [...form.allowed_domains, d])
      setDomainInput('')
    }
  }

  const removeDomain = (d: string) =>
    set('allowed_domains', form.allowed_domains.filter(x => x !== d))

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
    if (!confirm('Delete this chatbot? This cannot be undone.')) return
    setDeleting(true)
    try {
      await fetch(`/api/chatbots/${chatbot.id}`, { method: 'DELETE' })
      router.push('/chatbots')
    } finally {
      setDeleting(false)
    }
  }

  const allowedModels = plan === 'free'
    ? ['llama-3.1-8b-instant']
    : ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b']

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Basic */}
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 dark:text-white">Basic Info</h2>

        <Input label="Chatbot Name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="My Support Bot" />

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Avatar</label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => set('avatar', e)}
                className={`text-2xl w-11 h-11 rounded-lg border-2 transition ${form.avatar === e ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}
              >
                {e}
              </button>
            ))}
            <input
              type="text"
              value={form.avatar.startsWith(EMOJI_OPTIONS.includes(form.avatar) ? 'x' : form.avatar) ? form.avatar : ''}
              onChange={e => set('avatar', e.target.value)}
              placeholder="Custom"
              className="w-20 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Theme Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.theme_color}
              onChange={e => set('theme_color', e.target.value)}
              className="h-9 w-16 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-0.5"
            />
            <span className="text-sm text-gray-500 font-mono">{form.theme_color}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</p>
            <p className="text-xs text-gray-500">Widget is visible on embedded sites</p>
          </div>
          <button
            type="button"
            onClick={() => set('is_active', !form.is_active)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.is_active ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </Card>

      {/* AI Config */}
      <Card className="p-6 space-y-5">
        <h2 className="font-semibold text-gray-900 dark:text-white">AI Configuration</h2>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Model</label>
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
                    form.model === m ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'
                  } ${!available ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-300 cursor-pointer'}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{info.label}</span>
                      <Badge variant={info.tier === 'Free' ? 'success' : 'purple'}>{info.tier}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{info.description}</p>
                  </div>
                  {form.model === m && (
                    <div className="h-4 w-4 rounded-full bg-indigo-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
          {plan === 'free' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              Upgrade to Pro to unlock Standard & Advanced models
            </p>
          )}
        </div>

        <Textarea
          label="System Prompt"
          value={form.system_prompt}
          onChange={e => set('system_prompt', e.target.value)}
          rows={5}
          placeholder="You are a helpful customer support agent for Acme Corp..."
        />

        <Input
          label="Welcome Message"
          value={form.welcome_message}
          onChange={e => set('welcome_message', e.target.value)}
          placeholder="Hi! How can I help you today?"
        />
      </Card>

      {/* Security */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Allowed Domains</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Leave empty to allow all domains. Add specific domains to restrict embedding.
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
              <span key={d} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full">
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
          {chatbot ? 'Save Changes' : 'Create Chatbot'}
        </Button>
        {chatbot && (
          <Button variant="danger" size="sm" onClick={deleteChatbot} loading={deleting}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}
