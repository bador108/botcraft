import Image from 'next/image'
import Link from 'next/link'

const columns = [
  {
    title: 'Produkt',
    links: [
      { label: 'Funkce', href: '#features' },
      { label: 'Ceník', href: '#pricing' },
      { label: 'Docs', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Firma',
    links: [
      { label: 'O nás', href: '#' },
      { label: 'Kontakt', href: 'mailto:hello@botcraft.app' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Právní',
    links: [
      { label: 'Terms', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'GDPR', href: '#' },
    ],
  },
  {
    title: 'Socials',
    links: [
      { label: 'GitHub', href: 'https://github.com/bador108/botcraft' },
      { label: 'Twitter', href: '#' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-paper_border">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
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
          <div className="flex items-center gap-2">
            <Image src="/icon.svg" alt="BotCraft" width={16} height={16} />
            <span className="font-mono text-[11px] text-muted uppercase tracking-wider">BotCraft</span>
          </div>
          <p className="font-mono text-[11px] text-muted">
            Postaveno v Plzni · Běží na Groq · © {new Date().getFullYear()} BotCraft
          </p>
        </div>
      </div>
    </footer>
  )
}
