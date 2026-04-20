import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/app/source'
import { NextProvider } from 'fumadocs-core/framework/next'
import type { ReactNode } from 'react'
import 'fumadocs-ui/style.css'

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <NextProvider>
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: 'BotCraft Docs',
          url: '/docs',
        }}
      >
        {children}
      </DocsLayout>
    </NextProvider>
  )
}
