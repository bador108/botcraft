'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { getPresetAvatar, isImageUrl } from '@/lib/bot-avatars'

interface BotConfig {
  id: string
  name: string
  avatar: string
  theme_color: string
  welcome_message: string
  suggested_questions?: string[]
  show_badge?: boolean
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function AvatarDisplay({ avatar, size }: { avatar: string; size: number }) {
  const preset = getPresetAvatar(avatar)
  if (preset) {
    return (
      <div style={{ width: size, height: size, flexShrink: 0 }}>
        {preset.svg}
      </div>
    )
  }
  if (isImageUrl(avatar)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt="bot"
        style={{ width: size, height: size, borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
      />
    )
  }
  return <span style={{ fontSize: size * 0.7, lineHeight: 1, flexShrink: 0 }}>{avatar}</span>
}

export function WidgetChat({ bot, domain }: { bot: BotConfig; domain?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: bot.welcome_message },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Pošli barvu tématu rodiči pro chat bubble tlačítko
  useEffect(() => {
    window.parent.postMessage({ type: 'botcraft-theme', color: bot.theme_color || '#D4502A' }, '*')
  }, [bot.theme_color])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendText(text: string) {
    if (!text || loading) return
    setInput('')

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId: bot.id,
          messages: newMessages,
          domain: domain ?? window.location.hostname,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: err.reply ?? err.error ?? 'Něco se pokazilo. Zkus to znovu.' },
        ])
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullText += decoder.decode(value, { stream: true })
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: fullText },
        ])
      }
    } catch {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Chyba připojení. Zkus to znovu.' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  async function send() {
    await sendText(input.trim())
  }

  const showBadge = bot.show_badge !== false
  // Navrhované otázky zobrazíme po každé odpovědi asistenta (jako follow-up shortcuts)
  const lastMsg = messages[messages.length - 1]
  const showSuggestions = (bot.suggested_questions?.length ?? 0) > 0 && !loading && lastMsg?.role === 'assistant' && !!lastMsg.content

  return (
    <div className="flex flex-col h-dvh font-sans text-sm" style={{ background: '#F5F1EA', color: '#1A1814' }}>

      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0 border-b"
        style={{ borderColor: '#D9D0C0', background: '#EDE7DC' }}
      >
        <AvatarDisplay avatar={bot.avatar} size={28} />
        <div>
          <p className="font-semibold text-sm leading-tight" style={{ color: '#1A1814' }}>
            {bot.name}
          </p>
          <p className="text-[11px]" style={{ color: '#6B6359' }}>Online</p>
        </div>
      </div>

      {/* Zprávy */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
          >
            {msg.role === 'assistant' && (
              <div
                className="h-7 w-7 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden border"
                style={{ background: '#EDE7DC', borderColor: '#D9D0C0', borderRadius: '6px' }}
              >
                <AvatarDisplay avatar={bot.avatar} size={24} />
              </div>
            )}
            <div
              className="max-w-[78%] px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words"
              style={{
                borderRadius: '2px',
                ...(msg.role === 'user'
                  ? { background: bot.theme_color || '#D4502A', color: '#F5F1EA' }
                  : { background: '#EDE7DC', color: '#1A1814', border: '1px solid #D9D0C0' }),
              }}
            >
              {msg.content || (loading && i === messages.length - 1 ? (
                <span className="flex items-center gap-1">
                  {[0, 1, 2].map(j => (
                    <span
                      key={j}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: '#6B6359', animationDelay: `${j * 150}ms` }}
                    />
                  ))}
                </span>
              ) : '')}
            </div>
          </div>
        ))}

        {/* Navrhované otázky — po každé odpovědi asistenta */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 pl-9">
            {bot.suggested_questions!.map((q, i) => (
              <button
                key={i}
                onClick={() => sendText(q)}
                className="text-xs px-3 py-1.5 border transition-colors hover:bg-[#EDE7DC]"
                style={{
                  borderRadius: '2px',
                  borderColor: bot.theme_color || '#D4502A',
                  background: '#F5F1EA',
                  color: '#1A1814',
                  textAlign: 'left',
                  opacity: 0.85,
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-3 py-3 shrink-0 border-t"
        style={{ borderColor: '#D9D0C0', background: '#EDE7DC' }}
      >
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Napiš zprávu..."
            disabled={loading}
            style={{
              borderRadius: '2px',
              background: '#F5F1EA',
              border: '1px solid #D9D0C0',
              color: '#1A1814',
            }}
            className="flex-1 px-3 py-2 text-sm focus:outline-none focus:border-[#1A1814] transition-colors placeholder:text-[#6B6359] disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{ background: bot.theme_color || '#D4502A', borderRadius: '2px', width: '36px', height: '36px' }}
            className="flex items-center justify-center transition-opacity disabled:opacity-40 shrink-0 hover:opacity-90"
          >
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" style={{ color: '#F5F1EA' }} />
              : <Send className="h-4 w-4" style={{ color: '#F5F1EA' }} />
            }
          </button>
        </div>

        {/* Badge — skrytý pro Maker+ plány (show_badge === false) */}
        {showBadge && (
          <a
            href="https://botcraft.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-2 font-mono text-[10px] uppercase tracking-wider hover:opacity-70 transition-opacity"
            style={{ color: '#6B6359', fontFamily: 'monospace' }}
          >
            Powered by BotCraft
          </a>
        )}
      </div>
    </div>
  )
}
