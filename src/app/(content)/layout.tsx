import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-200">
      <Navbar />
      <main className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}
