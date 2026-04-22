'use client'

import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

export function NavbarAuth() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <Link
        href="/dashboard"
        className="text-sm bg-rust text-bone px-4 py-1.5 font-medium rounded-lg hover:bg-rust_hover transition-colors"
      >
        Dashboard →
      </Link>
    )
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="hidden sm:block text-sm text-muted hover:text-ink transition-colors px-3 py-1.5"
      >
        Přihlásit
      </Link>
      <Link
        href="/sign-up"
        className="text-sm bg-rust text-bone px-4 py-1.5 font-medium rounded-lg hover:bg-rust_hover transition-colors"
      >
        Zkusit zdarma
      </Link>
    </>
  )
}
