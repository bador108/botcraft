import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

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
  description: 'Nahraj PDF. Dostaneš skript. Tvoje stránka má chatbota. Postaveno na Groq LPU — odpovědi do 1 vteřiny.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'BotCraft — AI Chatbot Builder',
    description: 'Postaveno na Groq LPU. Odpovědi do 1 vteřiny. Postaveno v Plzni.',
    images: ['/og-image.png'], // TODO: vytvořit OG image
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
    <ClerkProvider>
      <html lang="cs" suppressHydrationWarning className={`${jetbrainsMono.variable} ${inter.variable}`}>
        <body className="antialiased font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}
