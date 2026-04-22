import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-theme'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BotCraft — AI Chatbot Builder',
  description: 'Postav AI chatbota se znalostní bází za pár minut. Jeden řádek kódu pro embed na libovolný web.',
  openGraph: {
    title: 'BotCraft — AI Chatbot Builder',
    description: 'Postav AI chatbota se znalostní bází za pár minut. Jeden řádek kódu pro embed na libovolný web.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  interactiveWidget: 'resizes-content',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
      <html lang="cs" suppressHydrationWarning className={`${jetbrainsMono.variable} ${inter.variable}`}>
        <body className="antialiased font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}
