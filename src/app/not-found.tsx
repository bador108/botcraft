import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bone flex flex-col items-center justify-center text-center px-8">
      <p
        className="font-mono font-medium text-paper_border select-none"
        style={{ fontSize: 'clamp(6rem, 20vw, 10rem)', lineHeight: 1, letterSpacing: '-0.04em' }}
      >
        404
      </p>
      <p className="font-mono text-base font-medium text-ink mt-6 mb-2 uppercase tracking-wide">
        Tahle stránka se ztratila v dokumentech
      </p>
      <p className="text-sm text-muted mb-8">
        Možná ji bot smazal. Nebo nikdy neexistovala.
      </p>
      <Link
        href="/"
        className="font-mono text-sm text-rust hover:text-rust_hover transition-colors uppercase tracking-wider"
      >
        Zpět na hlavní →
      </Link>
    </div>
  )
}
