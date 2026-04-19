import { SignUp } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { clerkAppearance } from '@/lib/clerk-theme'

export default async function SignUpPage() {
  const { userId } = await auth()
  if (userId) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Levý panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-between border-r border-paper_border">
        <Logo />
        <div>
          <p className="font-mono text-[11px] text-rust uppercase tracking-wider mb-4">
            Začínáme
          </p>
          <h1
            className="font-mono font-medium text-ink leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            Postav si svého prvního bota
          </h1>
          <p className="mt-4 text-muted text-base max-w-xs">
            50 zpráv zdarma. Žádná karta. Setup za 3 minuty.
          </p>
        </div>
        <p className="font-mono text-[11px] text-muted">© 2026 BotCraft</p>
      </div>

      {/* Pravý panel — formulář */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Logo na mobilu */}
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <SignUp forceRedirectUrl="/dashboard" appearance={clerkAppearance} />
        </div>
      </div>
    </div>
  )
}
