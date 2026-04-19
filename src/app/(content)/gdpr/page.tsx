/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GDPR — BotCraft',
  description: 'Jak BotCraft dodržuje GDPR a co to znamená pro tebe a tvoje uživatele.',
}

export default function GdprPage() {
  return (
    <div className="prose-content">
      <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3 not-prose">Právní</p>
      <h1>GDPR</h1>
      <p className="text-xs text-zinc-600 mb-8 not-prose">Poslední aktualizace: 15. dubna 2026</p>

      <p>
        BotCraft je v souladu s Nařízením EU 2016/679 (GDPR). Tato stránka vysvětluje konkrétně,
        jak GDPR dodržujeme a co to znamená pro tebe a tvé uživatele.
      </p>

      <blockquote>
        Potřebuješ <strong>DPA (Data Processing Agreement)</strong>? Napiš na{' '}
        <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link> — pošleme ti šablonu k podpisu
        (u placených plánů zdarma, automaticky).
      </blockquote>

      <h2>1. Naše role v GDPR</h2>
      <p>
        <strong>Ty jsi správce (controller).</strong> BotCraft používáš k tomu, abys poskytoval/a
        službu svým uživatelům. Vůči nim jsi správcem jejich osobních údajů.
      </p>
      <p>
        <strong>My jsme zpracovatel (processor).</strong> Zpracováváme data tvých uživatelů výhradně
        na tvůj pokyn a v rozsahu nezbytném pro provoz služby.
      </p>
      <p>
        Výjimka: u tvého vlastního účtu v BotCraftu jsme správce my.
      </p>

      <h2>2. Data Processing Agreement (DPA)</h2>
      <p>Máme připravenou standardní DPA dle čl. 28 GDPR, která obsahuje:</p>
      <ul>
        <li>Předmět, trvání a povahu zpracování</li>
        <li>Kategorie subjektů údajů a typy dat</li>
        <li>Povinnosti a práva stran</li>
        <li>Subzpracovatele a TOM (Technical and Organizational Measures)</li>
        <li>Postupy při data breach a práva auditu</li>
      </ul>
      <p>
        Napiš na <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link> a pošleme ti DPA k podpisu.
      </p>

      <h2>3. Subzpracovatelé</h2>
      <table>
        <thead>
          <tr>
            <th>Subzpracovatel</th>
            <th>Funkce</th>
            <th>Region</th>
            <th>Právní rámec</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Supabase Inc.',     'Databáze, storage',    'EU',     'SCC + data v EU'],
            ['Vercel Inc.',       'Hosting',              'EU',     'SCC + data v EU'],
            ['Clerk Inc.',        'Autentizace',          'USA',    'SCC'],
            ['Stripe Inc.',       'Platby',               'EU/USA', 'SCC + DPF'],
            ['Resend Inc.',       'E-maily',              'USA',    'SCC'],
            ['AI inference partner', 'Generování odpovědí', 'EU/USA', 'SCC + no-training'],
          ].map(([name, fn, region, legal]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{fn}</td>
              <td>{region}</td>
              <td>{legal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>O přidání nebo změně subzpracovatele informujeme 30 dnů dopředu. Máš právo vznést námitku.</p>

      <h2>4. Technická a organizační opatření (TOM)</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {[
          ['Šifrování v přenosu', 'TLS 1.3'],
          ['Šifrování v klidu', 'AES-256'],
          ['Oddělení environmentů', 'dev / staging / prod'],
          ['Pravidelné zálohy', 'Denní, retence 30 dní'],
          ['Principle of least privilege', 'Přístup k prod datům jen pro nezbytné role'],
          ['2FA admin účty', 'Vyžadováno'],
          ['Audit log', 'Všechny administrátorské akce'],
          ['Penetrační testy', 'Minimálně 1× ročně'],
        ].map(([label, value]) => (
          <div key={label} className="flex items-start gap-3 p-3 rounded-lg border border-white/[0.06] bg-[#0E0E12]">
            <svg className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-xs font-medium text-white">{label}</p>
              <p className="text-xs text-zinc-600 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>5. Data breach notification</h2>
      <p>V případě úniku dat:</p>
      <ul>
        <li>Budeš informován/a <strong>do 24 hodin</strong> od detekce</li>
        <li>Dostaneš povahu úniku, kategorie dotčených subjektů a přijatá opatření</li>
        <li>Poskytneme podporu pro tvou notifikaci ÚOOÚ (lhůta 72 hodin dle čl. 33 GDPR)</li>
      </ul>
      <p>
        Kontakt: <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link>
      </p>

      <h2>6. Práva subjektů údajů</h2>
      <table>
        <thead>
          <tr>
            <th>Právo</th>
            <th>Jak to uděláš v BotCraftu</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Přístup', 'Dashboard → Nastavení → Export'],
            ['Oprava', 'Manuální editace v konverzacích'],
            ['Výmaz', 'Dashboard → Konverzace → Smazat (podle ID uživatele)'],
            ['Omezení', 'Dočasné pozastavení chatbota'],
            ['Přenositelnost', 'Export ve formátu JSON/CSV'],
          ].map(([pravo, jak]) => (
            <tr key={pravo}>
              <td>{pravo}</td>
              <td>{jak}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>7. Přenosy mimo EU</h2>
      <p>
        Pro zákonnost přenosu dat do USA používáme Standard Contractual Clauses (SCC, verze 2021)
        a Data Privacy Framework (DPF) tam, kde je poskytovatel certifikován.
      </p>
      <p>
        <strong>Data tvých chatbotů a konverzací jsou uložena výhradně v EU.</strong> Do USA odchází
        pouze fakturační údaje (Stripe), autentizační tokeny (Clerk) a dočasně AI inference
        (odpověď se nevrací do tréninkových dat).
      </p>

      <h2>8. Kontaktní místo pro GDPR</h2>
      <p>
        E-mail: <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link><br />
        Odpovědní čas: do 30 dnů (urgentní případy do 48 hodin)
      </p>

      <h2>9. Dozorový úřad</h2>
      <p>
        <strong>Úřad pro ochranu osobních údajů</strong><br />
        Pplk. Sochora 27, 170 00 Praha 7<br />
        <Link href="https://uoou.cz">uoou.cz</Link> ·{' '}
        <Link href="mailto:posta@uoou.cz">posta@uoou.cz</Link>
      </p>

      <h2>10. Text pro tvoje uživatele</h2>
      <p>Můžeš ve svých podmínkách napsat třeba tohle:</p>
      <blockquote>
        „Chatbot na našem webu je postaven na platformě BotCraft. BotCraft zpracovává text zpráv,
        které s chatbotem sdílíš, výhradně pro vygenerování odpovědi. Data jsou uložena v EU,
        nepoužívají se k trénování AI modelů a můžeš požádat o jejich výmaz kontaktem na [tvůj e-mail]."
      </blockquote>
    </div>
  )
}
