'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Settings, BookOpen, Copy, Check, ExternalLink } from 'lucide-react'

export default function EmbedPage() {
  const params = useParams()
  const botId = params.id as string
  const [copied, setCopied] = useState(false)
  const [appUrl, setAppUrl] = useState('')

  useEffect(() => {
    setAppUrl(window.location.origin)
  }, [])

  const embedScript = `<script src="${appUrl}/widget.js" data-bot-id="${botId}" async></script>`

  const copy = () => {
    navigator.clipboard.writeText(embedScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Embed Chatbot</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add this script to your website</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/chatbots/${botId}`}>
            <Button variant="secondary" size="sm"><Settings className="h-4 w-4" /> Settings</Button>
          </Link>
          <Link href={`/chatbots/${botId}/knowledge`}>
            <Button variant="secondary" size="sm"><BookOpen className="h-4 w-4" /> Knowledge</Button>
          </Link>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Embed Script</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Paste this script tag just before the closing <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">&lt;/body&gt;</code> tag of your HTML page.
        </p>

        <div className="relative">
          <pre className="bg-gray-950 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto pr-14 font-mono leading-relaxed">
            {embedScript}
          </pre>
          <button
            onClick={copy}
            className="absolute top-3 right-3 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <Button onClick={copy} variant="secondary" size="sm">
          {copied ? <><Check className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy Script</>}
        </Button>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">Preview</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Open the widget in a new window to test it.
        </p>
        <a href={`${appUrl}/widget/${botId}`} target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="sm">
            <ExternalLink className="h-4 w-4" />
            Preview Widget
          </Button>
        </a>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white">How it works</h2>
        <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs flex items-center justify-center font-bold">1</span>
            Add the script tag to your website
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs flex items-center justify-center font-bold">2</span>
            A chat bubble appears in the bottom-right corner
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs flex items-center justify-center font-bold">3</span>
            Visitors click to open the chat — powered by your knowledge base
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-xs flex items-center justify-center font-bold">4</span>
            Set Allowed Domains in settings to restrict where the bot can be embedded
          </li>
        </ol>
      </Card>
    </div>
  )
}
