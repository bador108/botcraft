import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'BotCraft — AI Chatbot Builder',
  description: 'Build AI chatbots with a knowledge base and embed them anywhere.',
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
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
