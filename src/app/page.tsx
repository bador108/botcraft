import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { VideoSection } from '@/components/landing/VideoSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ModelTable } from '@/components/landing/ModelTable'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { ContactForm } from '@/components/landing/ContactForm'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <Navbar />
      <Hero />
      <VideoSection />
      <HowItWorks />
      <ModelTable />
      <Features />
      <Pricing />
      <FAQ />
      <FinalCTA />

      {/* Kontakt */}
      <section id="kontakt" className="border-t border-paper_border py-20 md:py-28 scroll-mt-14">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10">
              <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3">Kontakt</p>
              <h2 className="font-mono font-medium text-ink text-3xl md:text-4xl tracking-tight leading-tight mb-4">
                Napište nám
              </h2>
              <p className="text-muted text-base leading-relaxed">
                Máte otázku, nápad nebo chcete probrat spolupráci? Odpovídáme do 24 hodin.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />

      {/* BotCraft demo widget */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://botcraft.vercel.app/widget.js" data-bot-id="d451bea5-221b-48ce-a193-2a919efb1e02" async />
    </div>
  )
}
