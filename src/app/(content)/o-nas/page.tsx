import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'O nás — BotCraft',
  description: 'BotCraft dělá jednu věc a dělá ji dobře: mění tvoje dokumenty v chatbota.',
}

export default function ONasPage() {
  return (
    <div>
      <p className="text-xs text-[#A8A8A8] uppercase tracking-[0.15em] font-medium mb-3">O nás</p>
      <h1 className="font-display text-4xl font-bold text-[#0A0A0A] tracking-tight mb-4 leading-tight">
        Jedna věc.<br />Pořádně.
      </h1>
      <p className="text-[#6B6B6B] text-base leading-relaxed mb-14 max-w-xl">
        BotCraft mění tvoje dokumenty v chatbota, kterého embedneš na web jednou řádkou kódu.
      </p>

      {/* Proč to vzniklo */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-bold text-[#0A0A0A] mb-5">Proč to vzniklo</h2>
        <div className="space-y-4 text-sm text-[#6B6B6B] leading-relaxed">
          <p>
            Viděli jsme, jak firmy utrácí tisíce korun měsíčně za chatboty, kteří odpovídají pomalu,
            vypadají jako z roku 2018 a zákazníky spíš naštvou než potěší. Platformy jsou předražené
            a za každou drobnost — odstranění brandingu, custom doménu, víc dokumentů — si účtují extra.
          </p>
          <p>Chtěli jsme nástroj, který:</p>
          <ul className="space-y-2 list-none pl-0">
            {[
              ['Má transparentní cenu.', 'Co vidíš na ceníku, to zaplatíš. Žádné skryté add-ony.'],
              ['Je rychlý.', 'Odpovědi pod vteřinu, ne mezi „skoro vteřinou" a „pět vteřin".'],
              ['Funguje.', 'Uploadneš PDF, zkopíruješ skript, máš chatbota. Bez ML vědění, bez týdne konfigurace.'],
            ].map(([bold, rest]) => (
              <li key={bold as string} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#D4500A] shrink-0" />
                <span>
                  <span className="text-[#0A0A0A] font-semibold">{bold}</span>{' '}{rest}
                </span>
              </li>
            ))}
          </ul>
          <p>Tak jsme ho postavili.</p>
        </div>
      </section>

      <div className="border-t border-black/[0.06] my-10" />

      {/* Pro koho */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-bold text-[#0A0A0A] mb-5">Pro koho je BotCraft</h2>
        <ul className="space-y-2.5">
          {[
            'Máš web s dokumentací nebo FAQ a zákazníci se pořád ptají na to stejné',
            'Jsi agentura a chceš nabízet chatboty jako službu klientům',
            'Provozuješ e-shop nebo SaaS a chceš snížit zátěž supportu',
            'Máš interní wiki a chceš, aby v ní kolegové hledali mluvením, ne klikáním',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/20 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="border-t border-black/[0.06] my-10" />

      {/* Hodnoty */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-bold text-[#0A0A0A] mb-6">Hodnoty</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Jedna věc, pořádně.',
              desc: 'Neděláme generický AI platformu. Děláme chatbot builder. Když chceš workflow automatizaci, použij Zapier. Když chceš CRM, použij HubSpot.',
            },
            {
              title: 'Žádná vendor lock-in.',
              desc: 'Tvoje dokumenty, tvoje konverzace, tvoje data. Export do CSV kdykoliv. Pokud chceš odejít, odejdeš.',
            },
            {
              title: 'Transparentnost.',
              desc: 'Ceny, limity, i chyby se řeší veřejně. Changelog vedeme poctivě, data neskrýváme.',
            },
          ].map(({ title, desc }) => (
            <div key={title} className="p-5 rounded-xl border border-black/[0.06] bg-white shadow-sm">
              <p className="font-semibold text-[#0A0A0A] text-sm mb-2">{title}</p>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-black/[0.06] my-10" />

      {/* Kontakt */}
      <section>
        <h2 className="font-display text-xl font-bold text-[#0A0A0A] mb-4">Kontakt</h2>
        <div className="space-y-1 text-sm text-[#6B6B6B]">
          <p>
            E-mail:{' '}
            <Link href="mailto:fakturosupport@gmail.com" className="text-[#D4500A] hover:opacity-70 transition-opacity">
              fakturosupport@gmail.com
            </Link>
          </p>
          <p>
            Podpora:{' '}
            <Link href="mailto:fakturosupport@gmail.com" className="text-[#D4500A] hover:opacity-70 transition-opacity">
              fakturosupport@gmail.com
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
