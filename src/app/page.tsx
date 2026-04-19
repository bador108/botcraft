import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { VideoSection } from '@/components/landing/VideoSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { ModelTable } from '@/components/landing/ModelTable'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCTA } from '@/components/landing/FinalCTA'
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
      <Footer />
    </div>
  )
}
