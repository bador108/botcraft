import Link from 'next/link'
import { Logo } from '@/components/Logo'

const columns = [
  {
    title: 'Produkt',
    links: [
      { label: 'Funkce', href: '#features' },
      { label: 'Ceník', href: '#pricing' },
      { label: 'Docs', href: '#' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Firma',
    links: [
      { label: 'O nás', href: '/o-nas' },
      { label: 'Blog', href: '/blog' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
  },
  {
    title: 'Právní',
    links: [
      { label: 'Podmínky použití', href: '/terms' },
      { label: 'Ochrana soukromí', href: '/privacy' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-paper_border">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {columns.map(col => (
            <div key={col.title}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink hover:opacity-60 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-paper_border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Logo linkTo="/" />
          <p className="font-mono text-[11px] text-muted">
            © {new Date().getFullYear()} BotCraft · Postaveno pro tvůrce
          </p>
        </div>
      </div>
    </footer>
  )
}
