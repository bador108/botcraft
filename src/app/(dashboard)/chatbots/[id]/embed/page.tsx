'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BotNav } from '@/components/dashboard/bot-nav'
import { Copy, Check, ExternalLink } from 'lucide-react'

export default function EmbedPage() {
  const params = useParams()
  const botId = params.id as string
  const [copied, setCopied] = useState(false)
  const [appUrl, setAppUrl] = useState('')

  useEffect(() => { setAppUrl(window.location.origin) }, [])

  const embedScript = `<script src="${appUrl}/widget.js" data-bot-id="${botId}" async></script>`

  const copy = () => {
    navigator.clipboard.writeText(embedScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">Embed</h1>
        <p className="font-mono text-[11px] text-muted uppercase tracking-wider mt-1">Vložit chatbota na web</p>
      </div>

      <BotNav botId={botId} />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left: snippet + instructions */}
        <div className="space-y-6">
          <div>
            <p className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">Embed skript</p>
            <div className="border border-paper_border overflow-hidden" style={{ borderRadius: '2px' }}>
              <div className="flex items-center justify-between px-4 py-2 bg-paper border-b border-paper_border">
                <span className="font-mono text-[11px] text-muted">index.html</span>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 font-mono text-[11px] text-muted hover:text-ink transition-colors"
                >
                  {copied
                    ? <><Check className="h-3 w-3 text-success" /><span className="text-success">Zkopírováno</span></>
                    : <><Copy className="h-3 w-3" />Kopírovat</>
                  }
                </button>
              </div>
              <pre className="bg-bone px-5 py-4 text-[13px] font-mono leading-relaxed overflow-x-auto text-ink">
                <code>
                  <div className="text-muted">{'<!-- Vlož před </body> -->'}</div>
                  <div>{'<script'}</div>
                  <div>{'  src="'}<span className="text-rust">{appUrl}/widget.js</span>{'"'}</div>
                  <div>{'  data-bot-id="'}<span className="text-rust">{botId}</span>{'"'}</div>
                  <div>{'  async>'}</div>
                  <div>{'</script>'}</div>
                </code>
              </pre>
            </div>
          </div>

          <div>
            <p className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">Jak nainstalovat</p>
            <div className="space-y-3">
              {[
                'Vlož skript těsně před uzavírací tag </body>',
                'Chat bublina se automaticky zobrazí v pravém dolním rohu',
                'Uživatelé kliknou pro otevření — napojeno na tvoji knowledge base',
                'V nastavení nastav Povolené domény pro omezení embeddingu',
              ].map((step, i) => (
                <div key={i} className="flex gap-3 text-sm text-muted">
                  <span className="font-mono text-[11px] text-rust pt-0.5 shrink-0 w-5">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Info: skript je stabilní */}
          <div className="border border-paper_border rounded-lg p-4 bg-bone space-y-1">
            <p className="text-xs font-semibold text-ink">Skript není potřeba měnit</p>
            <p className="text-xs text-muted leading-relaxed">
              Barva, název, uvítací zpráva a celé nastavení bota se načítají živě z BotCraft při každém otevření stránky.
              Změníš-li cokoliv v dashboardu, projeví se to na webu automaticky — bez úpravy skriptu.
            </p>
          </div>

          {appUrl && (
            <a
              href={`${appUrl}/widget/${botId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[11px] text-muted uppercase tracking-wider hover:text-ink transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Otevřít widget v novém okně
            </a>
          )}
        </div>

        {/* Right: live preview */}
        {appUrl && (
          <div>
            <p className="font-mono text-[11px] text-muted uppercase tracking-wider mb-3">Náhled widgetu</p>
            <div className="border border-paper_border overflow-hidden" style={{ borderRadius: '2px' }}>
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-paper_border bg-paper">
                <span className="h-2 w-2 bg-paper_border border border-paper_border" style={{ borderRadius: '50%' }} />
                <span className="h-2 w-2 bg-paper_border border border-paper_border" style={{ borderRadius: '50%' }} />
                <span className="h-2 w-2 bg-paper_border border border-paper_border" style={{ borderRadius: '50%' }} />
                <span className="ml-3 font-mono text-[11px] text-muted">Náhled</span>
              </div>
              <div className="relative bg-bone" style={{ height: '480px' }}>
                <iframe
                  src={`${appUrl}/widget/${botId}`}
                  className="w-full h-full border-0"
                  title="Widget preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
