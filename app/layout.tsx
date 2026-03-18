import type { Metadata } from 'next'
import './globals.css'
import { CollectionProvider } from '@/context/CollectionContext'

export const metadata: Metadata = {
  title:       'MiniFig Tracker — Kinder Joy × Minecraft 2026',
  description: 'Track your complete Kinder Joy Minecraft 2026 figurine collection.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CollectionProvider>
          {children}
        </CollectionProvider>
      </body>
    </html>
  )
}