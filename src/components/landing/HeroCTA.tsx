'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

export function HeroCTA() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-4 flex-wrap mb-5">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-rust text-bone px-6 py-3 font-medium text-sm rounded-lg hover:bg-rust_hover transition-colors shadow-sm"
        >
          Dashboard →
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap mb-5">
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 bg-rust text-bone px-6 py-3 font-medium text-sm rounded-lg hover:bg-rust_hover transition-colors shadow-sm"
        >
          Začít zdarma →
        </Link>
        <a href="#video" className="text-sm text-muted hover:text-ink transition-colors">
          Živá ukázka ↓
        </a>
      </div>
      <p className="text-xs text-muted">
        50 zpráv zdarma · Bez platební karty · Setup za 3 minuty
      </p>
    </>
  )
}
