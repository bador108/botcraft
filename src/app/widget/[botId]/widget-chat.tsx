'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface BotConfig {
  id: string
  name: string
  avatar: string
  theme_color: string
  welcome_message: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function WidgetChat({ bot, domain }: { bot: BotConfig; domain?: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: bot.welcome_message },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Send theme color to parent for button color
  useEffect(() => {
    window.parent.postMessage({ type: 'botcraft-theme', color: bot.theme_color }, '*')
  }, [bot.theme_color])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Add placeholder assistant message
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
          { role: 'assistant', content: err.error ?? 'Something went wrong. Please try again.' },
        ])
        return
      }

      // Parse plain text stream (toTextStreamResponse)
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
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const color = bot.theme_color || '#6366f1'

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-sm">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ background: color }}
      >
        <span className="text-xl">{bot.avatar}</span>
        <div>
          <p className="font-semibold text-white text-sm leading-tight">{bot.name}</p>
          <p className="text-xs text-white/70">Powered by AI</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
            {msg.role === 'assistant' && (
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm"
                style={{ background: color + '20' }}
              >
                {bot.avatar}
              </div>
            )}
            <div
              className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === 'user'
                  ? 'text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
              style={msg.role === 'user' ? { background: color } : undefined}
            >
              {msg.content || (loading && i === messages.length - 1 ? (
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : '')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-100 shrink-0">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 px-3.5 py-2.5 rounded-full border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-transparent focus:ring-2 transition placeholder:text-gray-400 disabled:opacity-50"
            style={{ '--tw-ring-color': color } as React.CSSProperties}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="h-9 w-9 rounded-full flex items-center justify-center transition disabled:opacity-40 shrink-0"
            style={{ background: color }}
          >
            {loading
              ? <Loader2 className="h-4 w-4 text-white animate-spin" />
              : <Send className="h-4 w-4 text-white" />
            }
          </button>
        </div>
        <p className="text-center text-gray-300 text-[10px] mt-2">Powered by BotCraft</p>
      </div>
    </div>
  )
}
