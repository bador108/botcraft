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
    <div>
      <div className="mb-5">
        <h1 className="font-display font-semibold text-white text-lg tracking-tight">Embed</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Add this script to your website</p>
      </div>

      <BotNav botId={botId} />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left: snippet + instructions */}
        <div className="space-y-6">
          {/* Code block */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.12em] font-medium mb-3">Embed script</p>
            <div className="rounded-xl overflow-hidden border border-white/[0.07]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#0D0D12] border-b border-white/[0.07]">
                <span className="text-[11px] text-zinc-600 font-mono">index.html</span>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-white transition-colors"
                >
                  {copied
                    ? <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                    : <><Copy className="h-3 w-3" />Copy</>
                  }
                </button>
              </div>
              <pre className="bg-[#09090D] px-5 py-4 text-[13px] font-mono leading-relaxed overflow-x-auto">
                <code>
                  <div className="text-zinc-600">{'<!-- Add before </body> -->'}</div>
                  <div>
                    <span className="text-indigo-400">{'<script'}</span>
                  </div>
                  <div>
                    {'  '}<span className="text-lime-400">src</span>
                    <span className="text-zinc-400">{"=\""}</span>
                    <span className="text-orange-300">{appUrl}/widget.js</span>
                    <span className="text-zinc-400">{"\""}</span>
                  </div>
                  <div>
                    {'  '}<span className="text-lime-400">data-bot-id</span>
                    <span className="text-zinc-400">{"=\""}</span>
                    <span className="text-orange-300">{botId}</span>
                    <span className="text-zinc-400">{"\""}</span>
                  </div>
                  <div>
                    {'  '}<span className="text-lime-400">async</span>
                    <span className="text-indigo-400">{'>'}</span>
                  </div>
                  <div><span className="text-indigo-400">{'</script>'}</span></div>
                </code>
              </pre>
            </div>
          </div>

          {/* Steps */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.12em] font-medium mb-3">How to install</p>
            <div className="space-y-3">
              {[
                'Paste the script just before the closing </body> tag',
                'A chat bubble appears in the bottom-right corner automatically',
                'Users click to open — powered by your knowledge base',
                'Set Allowed Domains in Settings to restrict embedding to your sites',
              ].map((step, i) => (
                <div key={i} className="flex gap-3 text-sm text-zinc-400">
                  <span className="font-mono text-xs text-indigo-500 pt-0.5 shrink-0 w-4">{String(i + 1).padStart(2, '0')}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          {appUrl && (
            <a
              href={`${appUrl}/widget/${botId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open widget in new tab
            </a>
          )}
        </div>

        {/* Right: live preview */}
        {appUrl && (
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-[0.12em] font-medium mb-3">Live preview</p>
            <div className="border border-white/[0.07] rounded-xl overflow-hidden bg-[#0D0D12]">
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.07]">
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="h-2 w-2 rounded-full bg-white/10" />
                <span className="ml-3 text-[11px] text-zinc-600">Widget preview</span>
              </div>
              <div className="relative bg-zinc-900/50" style={{ height: '480px' }}>
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
