/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Podmínky použití — BotCraft',
  description: 'Podmínky použití služby BotCraft.',
}

export default function PodminkyPage() {
  return (
    <div className="prose-content">
      <p className="text-xs text-zinc-600 uppercase tracking-[0.15em] font-medium mb-3 not-prose">Právní</p>
      <h1>Podmínky použití</h1>
      <p className="text-xs text-zinc-600 mb-8 not-prose">Poslední aktualizace: 15. dubna 2026</p>

      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 mb-8">
        <p className="text-xs text-amber-400 leading-relaxed">
          <strong className="text-amber-300">Upozornění:</strong> Toto je template, ne finální právní dokument.
          Před nasazením na produkci si ho nech zkontrolovat od advokáta specializovaného na IT smlouvy a GDPR.
        </p>
      </div>

      <p>
        Používáním služby BotCraft (dále jen „služba") souhlasíš s těmito podmínkami.
        Pokud nesouhlasíš, službu prosím nepoužívej.
      </p>

      <h2>1. Kdo jsme</h2>
      <p>
        Službu BotCraft provozuje <strong>[Tvoje jméno / firma, IČO, adresa]</strong> (dále jen „my" nebo „poskytovatel").
        Kontakt: <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link>.
      </p>

      <h2>2. Co služba dělá</h2>
      <p>
        BotCraft je platforma, která ti umožňuje vytvořit AI chatbota na základě dokumentů, které nahraješ,
        a embednout ho na web pomocí script tagu. Podrobnosti funkcí jsou popsané na stránkách{' '}
        <Link href="/">Funkce</Link> a <Link href="/#pricing">Ceník</Link>.
      </p>

      <h2>3. Tvůj účet</h2>
      <p>Pro používání služby potřebuješ účet. Zavazuješ se:</p>
      <ul>
        <li>Poskytnout pravdivé registrační údaje</li>
        <li>Chránit své přihlašovací údaje a nesdílet je</li>
        <li>Nahlásit nám bez zbytečného odkladu jakékoliv neoprávněné použití účtu</li>
        <li>Nést odpovědnost za vše, co se pod tvým účtem stane</li>
      </ul>
      <p>Účet můžeme pozastavit nebo zrušit, pokud porušíš tyto podmínky nebo nezaplatíš za placený plán.</p>

      <h2>4. Placené plány a platby</h2>
      <ul>
        <li>Ceny jsou uvedené v ceníku včetně DPH (je-li aplikovatelná)</li>
        <li>Platby zpracovává Stripe; my neuchováváme platební údaje</li>
        <li>Plán se automaticky obnovuje na konci období, pokud nezrušíš</li>
        <li>Zrušení je účinné ke konci aktuálního fakturačního období</li>
        <li>V případě nezaplacení může být služba pozastavena po 7 dnech od splatnosti</li>
      </ul>
      <p>
        <strong>Vrácení peněz:</strong> Do 14 dnů od prvního zaplacení máš nárok na vrácení peněz bez udání důvodu
        (odstoupení od smlouvy dle § 1829 OZ). Napiš na{' '}
        <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link>.
      </p>

      <h2>5. Tvůj obsah</h2>
      <p>
        <strong>Tobě patří, co nahraješ.</strong> Dokumenty, system prompty, konverzace — to vše zůstává
        tvoje intelektuální vlastnictví. My získáváme pouze licenci zpracovávat tvůj obsah v rozsahu nutném
        pro fungování služby.
      </p>
      <p>Nenahrávej obsah, který:</p>
      <ul>
        <li>Porušuje cizí autorská práva nebo jiná práva třetích stran</li>
        <li>Obsahuje osobní údaje třetích osob bez právního titulu</li>
        <li>Je nelegální, nenávistný, nebo jinak v rozporu s dobrými mravy</li>
        <li>Obsahuje malware, viry nebo kód poškozující systémy</li>
      </ul>
      <p>Porušení = právo na okamžité zrušení účtu bez náhrady.</p>

      <h2>6. Co je zakázáno</h2>
      <p>Nesmíš službu používat k:</p>
      <ul>
        <li>Vytváření chatbotů, kteří se vydávají za reálné osoby bez jejich souhlasu</li>
        <li>Spamu, phishingu nebo podvodům</li>
        <li>Reverse engineeringu, scrapingu nebo pokusům o prolomení zabezpečení</li>
        <li>Přetěžování infrastruktury (DoS útoky, automatizovaný abuse)</li>
        <li>Obcházení limitů plánu</li>
      </ul>

      <h2>7. Dostupnost služby</h2>
      <p>
        Snažíme se o vysokou dostupnost, ale neposkytujeme garantovaný uptime (SLA) u plánů Hobby, Maker
        a Studio. SLA 99,9 % platí pouze pro Enterprise plán. Plánované odstávky oznamujeme dopředu.
      </p>

      <h2>8. Odpovědnost za obsah chatbota</h2>
      <p>
        <strong>AI chatboti nejsou neomylní.</strong> Odpovědi, které bot generuje, mohou být nepřesné,
        zastaralé nebo zavádějící. Ty jsi odpovědný/á za obsah knowledge base, konfiguraci system promptu
        a způsob, jakým chatbota prezentuješ svým uživatelům.
      </p>
      <p>
        Doporučujeme přidat disclaimer: <em>„Odpovědi generuje AI, mohou být nepřesné."</em>
      </p>

      <h2>9. Omezení odpovědnosti</h2>
      <p>
        Služba je poskytována „jak je" (as-is). Do rozsahu povoleného zákonem neodpovídáme za nepřímé
        škody, ztrátu zisku ani ztrátu dat. Naše maximální odpovědnost je omezena na částku, kterou jsi
        zaplatil/a za službu v posledních 12 měsících.
      </p>

      <h2>10. Změny podmínek</h2>
      <p>
        O podstatných změnách tě informujeme e-mailem 30 dnů dopředu. Pokračováním v používání služby
        po účinnosti změn s novou verzí souhlasíš.
      </p>

      <h2>11. Ukončení</h2>
      <p>
        Účet můžeš zrušit kdykoliv v nastavení. Tvá data jsou uchována 30 dnů pro případ obnovení.
        Po 30 dnech jsou nenávratně smazána. Fakturační doklady uchováváme po dobu vyžadovanou zákonem.
      </p>

      <h2>12. Rozhodné právo a soudní příslušnost</h2>
      <p>
        Tyto podmínky se řídí právem České republiky. Pro řešení sporů jsou příslušné soudy ČR.
        Spotřebitelé mohou využít mimosoudní řešení sporů skrze{' '}
        <Link href="https://coi.cz">Českou obchodní inspekci</Link>.
      </p>

      <h2>13. Kontakt</h2>
      <p>
        Dotazy k podmínkám:{' '}
        <Link href="mailto:fakturosupport@gmail.com">fakturosupport@gmail.com</Link>
      </p>
    </div>
  )
}
