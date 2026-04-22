'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { Logo } from '@/components/Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-bone border-b border-paper_border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Logo linkTo="/" className="hover:opacity-70 transition-opacity" />

        {/* Nav links — center */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Funkce', href: '#features' },
            { label: 'Ceník', href: '#pricing' },
            { label: 'Kontakt', href: '#kontakt' },
            { label: 'GitHub', href: 'https://github.com/bador108/botcraft' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Actions — right */}
        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="text-sm bg-rust text-bone px-4 py-1.5 font-medium rounded-lg hover:bg-rust_hover transition-colors"
            >
              Dashboard →
            </Link>
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  )
}
