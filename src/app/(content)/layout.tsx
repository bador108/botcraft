import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#0A0A0A]">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}
