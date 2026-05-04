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
  if (preset) return <div style={{ width: size, height: size, flexShrink: 0 }}>{preset.svg}</div>
  if (isImageUrl(avatar)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={avatar} alt="bot" style={{ width: size, height: size, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
    )
  }
  return <span style={{ fontSize: size * 0.7, lineHeight: 1, flexShrink: 0 }}>{avatar}</span>
}

export function WidgetChat({ bot, domain }: { bot: BotConfig; domain?: string }) {
  const theme = bot.theme_color || '#0c0c0e'
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: bot.welcome_message },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    window.parent.postMessage({ type: 'botcraft-theme', color: theme }, '*')
  }, [theme])

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
  const lastMsg = messages[messages.length - 1]
  const showSuggestions =
    (bot.suggested_questions?.length ?? 0) > 0 &&
    !loading &&
    lastMsg?.role === 'assistant' &&
    !!lastMsg.content

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#ffffff', color: '#0c0c0e', fontFamily: "'DM Sans', -apple-system, system-ui, sans-serif", fontSize: 14 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid #ececef', background: '#ffffff', flexShrink: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: theme,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden',
        }}>
          <AvatarDisplay avatar={bot.avatar} size={22} />
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3, color: '#0c0c0e', margin: 0 }}>{bot.name}</p>
          <p style={{ fontSize: 11, color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            Online
          </p>
        </div>
      </div>

      {/* Zprávy */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 26, height: 26, borderRadius: 6, background: theme,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2, overflow: 'hidden',
              }}>
                <AvatarDisplay avatar={bot.avatar} size={18} />
              </div>
            )}
            <div style={{
              maxWidth: '78%', padding: '10px 13px', fontSize: 13, lineHeight: 1.6,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word', borderRadius: 12,
              ...(msg.role === 'user'
                ? { background: theme, color: '#ffffff', borderBottomRightRadius: 4 }
                : { background: '#f5f5f4', color: '#0c0c0e', borderBottomLeftRadius: 4 }
              ),
            }}>
              {msg.content || (loading && i === messages.length - 1 ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  {[0, 1, 2].map(j => (
                    <span key={j} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#9ca3af',
                      display: 'inline-block',
                      animation: 'bounce 1.2s infinite',
                      animationDelay: `${j * 0.15}s`,
                    }} />
                  ))}
                </span>
              ) : '')}
            </div>
          </div>
        ))}

        {/* Suggested questions */}
        {showSuggestions && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 34 }}>
            {bot.suggested_questions!.map((q, i) => (
              <button
                key={i}
                onClick={() => sendText(q)}
                style={{
                  fontSize: 12, padding: '5px 10px', borderRadius: 20,
                  border: `1px solid #ececef`, background: '#ffffff', color: '#0c0c0e',
                  cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = theme; (e.target as HTMLElement).style.background = '#fafafa' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#ececef'; (e.target as HTMLElement).style.background = '#ffffff' }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px', borderTop: '1px solid #ececef', background: '#ffffff', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Napiš zprávu…"
            disabled={loading}
            style={{
              flex: 1, padding: '9px 14px', borderRadius: 24, fontSize: 13,
              border: '1px solid #e5e7eb', background: '#f9fafb', color: '#0c0c0e',
              outline: 'none', transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = '#9ca3af')}
            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: theme, cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: (!input.trim() || loading) ? 0.4 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {loading
              ? <Loader2 size={15} color="#ffffff" style={{ animation: 'spin 1s linear infinite' }} />
              : <Send size={15} color="#ffffff" />
            }
          </button>
        </div>

        {showBadge && (
          <a
            href="https://botcraft.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', marginTop: 8, fontSize: 10, color: '#9ca3af', textDecoration: 'none', letterSpacing: '0.05em' }}
          >
            Powered by BotCraft
          </a>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  )
}
