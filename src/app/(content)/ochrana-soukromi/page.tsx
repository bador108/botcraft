import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ochrana soukromí — BotCraft',
  description: 'Zásady ochrany soukromí a zpracování osobních údajů BotCraft.',
}

export default function OchranaSoukromiPage() {
  return (
    <div className="prose-content">
      <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3 not-prose">Právní</p>
      <h1>Ochrana soukromí</h1>
      <p className="text-xs text-zinc-600 mb-8 not-prose">Poslední aktualizace: 15. dubna 2026</p>

      <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 mb-8">
        <p className="text-sm text-zinc-300 leading-relaxed">
          <strong>Shrnutí:</strong> Neprodáváme data, nepoužíváme je k trénování AI modelů,
          uchováváme je v EU.
        </p>
      </div>

      <h2>1. Kdo je správce</h2>
      <p>
        Správcem osobních údajů je <strong>[Tvoje jméno / firma, IČO, adresa]</strong>.
        Kontakt: <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link>.
      </p>

      <h2>2. Jaké údaje zpracováváme</h2>

      <h3>A) Účet</h3>
      <ul>
        <li>E-mail, jméno (pokud ho uvedeš)</li>
        <li>Hash hesla nebo OAuth token (podle způsobu přihlášení)</li>
        <li>IP adresa při registraci (pro bezpečnost)</li>
      </ul>

      <h3>B) Používání služby</h3>
      <ul>
        <li>Dokumenty, které nahraješ</li>
        <li>System prompty a konfigurace chatbotů</li>
        <li>Konverzace, které tvoji boti vedou s koncovými uživateli</li>
        <li>Metadata použití (počet zpráv, timestamp, model)</li>
      </ul>

      <h3>C) Fakturační údaje</h3>
      <ul>
        <li>Jméno, adresa, IČO/DIČ (pokud firma)</li>
        <li>Platební údaje zpracovává <strong>výhradně Stripe</strong> — my je neuchováváme</li>
      </ul>

      <h3>D) Technická data</h3>
      <ul>
        <li>Logy serveru (IP, user agent, URL) — uchováno 30 dní pro bezpečnost</li>
        <li>Cookies nezbytné pro funkci aplikace</li>
      </ul>

      <h2>3. Proč to zpracováváme (právní titul)</h2>
      <table>
        <thead>
          <tr>
            <th>Účel</th>
            <th>Právní titul</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Poskytování služby', 'Plnění smlouvy (čl. 6/1/b GDPR)'],
            ['Fakturace', 'Plnění smlouvy + zákonná povinnost'],
            ['Bezpečnost, prevence zneužití', 'Oprávněný zájem (čl. 6/1/f)'],
            ['Marketing (newsletter)', 'Souhlas (čl. 6/1/a), vždy opt-in'],
            ['Analytika použití', 'Oprávněný zájem, anonymizováno'],
          ].map(([ucel, titul]) => (
            <tr key={ucel}>
              <td>{ucel}</td>
              <td>{titul}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>4. Kde data běží</h2>
      <ul>
        <li><strong>Hlavní databáze:</strong> Supabase, region Frankfurt (EU)</li>
        <li><strong>Hosting aplikace:</strong> Vercel, region Frankfurt (EU)</li>
        <li><strong>Autentizace:</strong> Clerk (USA) — SCC uzavřené</li>
        <li><strong>Platby:</strong> Stripe (USA/EU) — SCC uzavřené</li>
      </ul>
      <p>Data konverzací jsou uložena <strong>výhradně v EU</strong>.</p>

      <h2>5. Používáme tvůj obsah k trénování AI?</h2>
      <p>
        <strong>Ne.</strong> Tvoje dokumenty, system prompty ani konverzace nikdy nepoužíváme
        k trénování žádných AI modelů — našich ani cizích. AI poskytovatelé, které používáme pro
        inference, mají ve smlouvách explicitní zákaz trénování na zákaznických datech.
      </p>

      <h2>6. Komu data předáváme</h2>
      <table>
        <thead>
          <tr>
            <th>Zpracovatel</th>
            <th>Účel</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Supabase', 'Databáze, storage', 'EU'],
            ['Vercel', 'Hosting', 'EU'],
            ['Clerk', 'Autentizace uživatelů', 'USA (SCC)'],
            ['Stripe', 'Platby', 'EU/USA (SCC)'],
            ['Resend', 'Transakční e-maily', 'EU'],
            ['AI inference partner', 'Generování odpovědí', 'EU/USA (SCC, no-training)'],
          ].map(([zpracovatel, ucel, region]) => (
            <tr key={zpracovatel}>
              <td>{zpracovatel}</td>
              <td>{ucel}</td>
              <td>{region}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Neprodáváme data třetím stranám pro marketing ani jiné účely.</p>

      <h2>7. Jak dlouho data uchováváme</h2>
      <ul>
        <li><strong>Účet a obsah:</strong> po dobu aktivního účtu + 30 dní po zrušení</li>
        <li><strong>Fakturace:</strong> 10 let (zákonná povinnost)</li>
        <li><strong>Logy serveru:</strong> 30 dní</li>
        <li><strong>Marketingové e-maily:</strong> do odhlášení odběru</li>
      </ul>

      <h2>8. Tvá práva</h2>
      <p>Máš právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost dat a vznesení námitky. Export je dostupný v nastavení účtu. Souhlas s marketingem lze odvolat v patičce každého e-mailu.</p>
      <p>
        Stížnost můžeš podat u{' '}
        <Link href="https://uoou.cz">Úřadu pro ochranu osobních údajů</Link>.
        Pro uplatnění práv: <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link>.
        Odpovídáme do 30 dnů.
      </p>

      <h2>9. Cookies</h2>
      <p>
        Používáme pouze <strong>nezbytné cookies</strong> (session, CSRF) a anonymizované analytické
        cookies (PostHog, self-hosted EU). Nepoužíváme reklamní cookies ani tracking pixely třetích stran.
      </p>

      <h2>10. Bezpečnost</h2>
      <ul>
        <li>Veškerá komunikace HTTPS (TLS 1.3)</li>
        <li>Hesla jsou hashována (Clerk)</li>
        <li>Databáze šifrována at-rest</li>
        <li>Pravidelné bezpečnostní audity</li>
        <li>2FA dostupné pro všechny účty</li>
      </ul>

      <h2>11. Změny této politiky</h2>
      <p>O podstatných změnách tě informujeme e-mailem 30 dnů dopředu.</p>

      <h2>12. Kontakt</h2>
      <p>
        <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link>
      </p>
    </div>
  )
}
