'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const topicOptions = [
  { value: 'obecny',  label: 'Obecný dotaz' },
  { value: 'podpora', label: 'Technická podpora' },
  { value: 'obchod',  label: 'Obchodní dotaz' },
  { value: 'pr',      label: 'Tiskový dotaz / PR' },
]

const fieldClass = 'w-full bg-white border border-paper_border rounded-lg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-rust/40 transition-colors'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError(null)

    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      topic:   (form.elements.namedItem('topic')   as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Odeslání se nezdařilo')
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Něco se pokazilo. Zkus to znovu nebo napiš přímo na botcraftsupport@gmail.com.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-paper_border bg-bone p-8 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-rust/20 bg-rust/10 mb-4">
          <svg className="h-4 w-4 text-rust" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold text-ink text-sm mb-1">Zpráva odeslána</p>
        <p className="text-xs text-muted">Ozveme se do 24 hodin.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs text-muted mb-1.5">Jméno</label>
          <input id="name" name="name" type="text" required placeholder="Jan Novák" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-muted mb-1.5">E-mail</label>
          <input id="email" name="email" type="email" required placeholder="jan@firma.cz" className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="topic" className="block text-xs text-muted mb-1.5">Typ dotazu</label>
        <select id="topic" name="topic" required className={fieldClass}>
          {topicOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs text-muted mb-1.5">Zpráva</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Napiš nám..."
          className={`${fieldClass} resize-none`}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-rust text-bone px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rust_hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Odesílám...' : 'Odeslat zprávu'}
      </button>
    </form>
  )
}
