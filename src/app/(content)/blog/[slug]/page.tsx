import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — BotCraft',
}

export default function BlogPostPage() {
  return (
    <div>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-12"
      >
        <ArrowLeft className="h-3 w-3" />
        Blog
      </Link>

      <div className="py-16 text-center">
        <p className="font-mono text-xs text-zinc-600 uppercase tracking-wider mb-4">Brzy</p>
        <h1 className="font-display text-3xl font-bold text-white tracking-tight mb-3">
          Článek se připravuje
        </h1>
        <p className="text-sm text-zinc-500">Pracujeme na tom.</p>
      </div>
    </div>
  )
}
