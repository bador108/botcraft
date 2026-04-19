'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatMsg {
  role: 'user' | 'bot'
  text: string
}

const SAMPLE_TEXT = `BotCraft je český AI chatbot builder. Nabízíme 3 modely: Fast, Balanced, Premium. Ceny začínají na 490 Kč/měs za plán Maker. Podporujeme PDF, TXT a Markdown dokumenty. Setup trvá 3 minuty.`

function getMockReply(query: string, botName: string): string {
  const q = query.toLowerCase()
  if (q.includes('cena') || q.includes('cen') || q.includes('kolik') || q.includes('stojí') || q.includes('490') || q.includes('price')) {
    return `Podle informací začínají ceny na 490 Kč/měs za plán Maker. Je tu také Hobby plán zdarma (50 zpráv/měs).`
  }
  if (q.includes('model') || q.includes('fast') || q.includes('premium') || q.includes('balanced')) {
    return `${botName} má přístup ke třem modelům: Fast (okamžité odpovědi), Balanced (vyvážená kvalita) a Premium (dlouhé dokumenty). Výběr závisí na tvém plánu.`
  }
  if (q.includes('pdf') || q.includes('dokument') || q.includes('soubor') || q.includes('upload')) {
    return `Podporuji PDF, TXT a Markdown dokumenty. Po nahrání dokumentu automaticky zpracuji obsah a budu odpovídat z něj.`
  }
  if (q.includes('jak') || q.includes('setup') || q.includes('start') || q.includes('začít')) {
    return `Setup je jednoduchý: 1) Vytvoř bota, 2) Nahraj dokumenty, 3) Zkopíruj <script> tag na svůj web. Celé to trvá ~3 minuty.`
  }
  return `Jsem ${botName}, demo chatbot postavený na BotCraft. Zeptej se mě třeba na ceny, modely nebo jak začít.`
}

export function InteractiveBuilder() {
  const [botName, setBotName] = useState('Pepa')
  const [sampleText, setSampleText] = useState(SAMPLE_TEXT)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, typing])

  function sendMessage() {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setTyping(true)

    setTimeout(() => {
      const reply = getMockReply(userMsg, botName)
      setTyping(false)
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
    }, 900)

    // TODO: Replace with real Groq API call in production
  }

  const inputClass = `w-full border border-paper_border bg-bone text-ink text-sm px-3 py-2 outline-none focus:border-ink transition-colors placeholder:text-muted`
  const labelClass = `block text-[11px] font-mono uppercase tracking-wider text-muted mb-1`

  return (
    <div className="border border-paper_border bg-paper" style={{ borderRadius: '2px' }}>
      {/* Step tabs */}
      <div className="flex border-b border-paper_border">
        {([1, 2, 3] as const).map(s => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex-1 py-2.5 text-[11px] font-mono uppercase tracking-wider transition-colors ${
              step === s
                ? 'bg-ink text-bone'
                : 'text-muted hover:text-ink'
            }`}
          >
            {s === 1 ? '01 Jméno' : s === 2 ? '02 Obsah' : '03 Chat'}
          </button>
        ))}
      </div>

      <div className="p-4">
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Jméno bota</label>
              <input
                className={inputClass}
                value={botName}
                onChange={e => setBotName(e.target.value)}
                placeholder="Pepa"
                maxLength={30}
              />
            </div>
            <p className="text-[12px] text-muted">Toto jméno uvidí uživatelé v chat widgetu.</p>
            <button
              onClick={() => setStep(2)}
              className="text-[11px] font-mono uppercase tracking-wider text-rust hover:text-rust_hover transition-colors"
            >
              Další krok →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Ukázkový text</label>
              <textarea
                className={`${inputClass} resize-none`}
                rows={5}
                value={sampleText}
                onChange={e => setSampleText(e.target.value)}
                placeholder="Napiš sem popis svého produktu nebo služby..."
              />
            </div>
            <p className="text-[12px] text-muted">V produkci nahraj PDF. Bot se z něj naučí odpovídat.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="text-[11px] font-mono uppercase tracking-wider text-muted hover:text-ink transition-colors"
              >
                ← Zpět
              </button>
              <button
                onClick={() => {
                  setStep(3)
                  if (messages.length === 0) {
                    setMessages([{
                      role: 'bot',
                      text: `Ahoj! Jsem ${botName || 'bot'}. Zeptej se mě na cokoliv o produktu.`,
                    }])
                  }
                }}
                className="text-[11px] font-mono uppercase tracking-wider text-rust hover:text-rust_hover transition-colors"
              >
                Spustit chat →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            {/* Chat window */}
            <div
              ref={chatRef}
              className="h-48 overflow-y-auto space-y-2 pr-1"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-ink text-bone'
                        : 'bg-bone border border-paper_border text-ink'
                    }`}
                    style={{ borderRadius: '2px' }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 bg-bone border border-paper_border" style={{ borderRadius: '2px' }}>
                    <span className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                className={`${inputClass} flex-1`}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Zeptej se na cenu, modely..."
                disabled={typing}
              />
              <button
                onClick={sendMessage}
                disabled={typing || !input.trim()}
                className="px-3 py-2 bg-rust text-bone text-sm font-mono hover:bg-rust_hover disabled:opacity-40 transition-colors"
                style={{ borderRadius: '2px' }}
              >
                →
              </button>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-[11px] font-mono uppercase tracking-wider text-muted hover:text-ink transition-colors"
            >
              ← Zpět
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
