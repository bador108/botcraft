'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { Plus } from 'lucide-react'

const items = [
  {
    q: 'Jak rychle to postavím?',
    a: 'Od uploadu dokumentu po funkční chat na webu: 3–5 minut.',
  },
  {
    q: 'Co se stane, když překročím limit zpráv?',
    a: 'Chatbot odpoví návštěvníkům zprávou, že se vrátí 1. dne příštího měsíce, a tobě pošleme email. Žádné auto-billing, žádné překvapení.',
  },
  {
    q: 'Můžu exportovat data?',
    a: 'Ano, kdykoli. CSV export konverzací je v každém placeném plánu.',
  },
  {
    q: 'Kde běží data?',
    a: 'Supabase (Frankfurt, EU). GDPR compliant.',
  },
  {
    q: 'Můžu zrušit kdykoli?',
    a: 'Ano. Žádná smlouva, žádný notice period.',
  },
  {
    q: 'Proč jsou odpovědi tak rychlé?',
    a: 'Používáme specializovanou infrastrukturu optimalizovanou pro chat v reálném čase. Odpovědi přichází typicky do 1 vteřiny — plynulá konverzace bez čekání.',
  },
]

export function FAQ() {
  return (
    <section className="border-t border-paper_border py-20 md:py-28">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-16">
          <div>
            <h2
              className="font-mono font-medium text-ink"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
            >
              Časté otázky
            </h2>
          </div>

          <Accordion.Root type="single" collapsible className="space-y-0">
            {items.map((item, i) => (
              <Accordion.Item
                key={i}
                value={`item-${i}`}
                className="border-b border-paper_border"
              >
                <Accordion.Trigger className="w-full flex items-center justify-between py-5 text-left group cursor-pointer">
                  <span className="text-sm font-medium text-ink pr-4">
                    {item.q}
                  </span>
                  <Plus
                    size={16}
                    className="text-muted shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]:rotate-45 group-data-[state=open]:text-rust"
                  />
                </Accordion.Trigger>
                <Accordion.Content
                  className="overflow-hidden data-[state=open]:animate-[slideDown_300ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[slideUp_200ms_ease]"
                >
                  <p className="text-sm text-muted leading-relaxed pb-5 max-w-lg">
                    {item.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  )
}
