import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/landing/ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt — BotCraft',
  description: 'Napiš nám. Odpovídáme obvykle do 24 hodin.',
}

const contacts = [
  {
    label: 'Obecné dotazy',
    email: 'fakturosupport@gmail.com',
    desc: 'Pro otázky typu „jak funguje X" nebo „můžu dělat Y".',
  },
  {
    label: 'Technická podpora',
    email: 'fakturosupport@gmail.com',
    desc: 'Když něco nefunguje nebo potřebuješ pomoc s konfigurací. Přilož prosím ID chatbota a popis problému.',
  },
  {
    label: 'Obchodní dotazy',
    email: 'fakturosupport@gmail.com',
    desc: 'Enterprise plány, partnerství, reseller program, faktury na IČO.',
  },
  {
    label: 'Tisk a PR',
    email: 'fakturosupport@gmail.com',
    desc: 'Tiskové dotazy, rozhovory, média.',
  },
]

export default function KontaktPage() {
  return (
    <div>
      <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3">Kontakt</p>
      <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">Napiš nám</h1>
      <p className="text-zinc-500 text-sm mb-14">
        Odpovídáme obvykle do 24 hodin. Na placených plánech do 12 hodin.
      </p>

      {/* Kontaktní e-maily */}
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {contacts.map(({ label, email, desc }) => (
          <div key={email} className="p-5 rounded-xl border border-white/[0.06] bg-[#0E0E12]">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
            <Link
              href={`mailto:${email}`}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {email}
            </Link>
            <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Formulář */}
      <div className="mb-14">
        <h2 className="font-display text-xl font-bold text-white mb-6">Formulář</h2>
        <ContactForm />
      </div>

      {/* Security */}
      <div className="border-t border-white/[0.06] pt-10">
        <h2 className="font-display text-base font-semibold text-white mb-3">
          Hlášení bezpečnostních chyb
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed mb-2">
          Našel/a jsi zranitelnost? Díky, že to hlásíš zodpovědně.
        </p>
        <Link
          href="mailto:fakturosupport@gmail.com"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          fakturosupport@gmail.com
        </Link>
        <p className="text-xs text-zinc-600 mt-2">
          Odpovídáme do 48 hodin. Prosíme o 90 dnů před zveřejněním, než vydáme patch.
        </p>
      </div>
    </div>
  )
}
