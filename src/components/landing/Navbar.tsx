'use client'

import { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo'
import { NavbarAuth } from './NavbarAuth'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

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

        {/* Actions — right (auth-aware client island) */}
        <div className="flex items-center gap-2">
          <NavbarAuth />
        </div>
      </div>
    </nav>
  )
}
