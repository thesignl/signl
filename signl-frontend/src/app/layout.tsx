import './globals.css'

import type { Metadata, Viewport } from 'next'
import {
  Source_Serif_4,
  Inter,
  JetBrains_Mono,
} from 'next/font/google'

import AuthProvider from '@/components/common/AuthProvider'
import BookmarkProvider from '@/components/common/BookmarkProvider'
import ToastProvider from '@/components/common/ToastProvider'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Ticker from '@/components/layout/Ticker'

import SearchOverlay from '@/features/search/SearchOverlay'
import SavedPanel from '@/features/bookmarks/SavedPanel'

const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Signl — Intelligence-first editorial for markets, macro, and systems',
    template: '%s · Signl',
  },
  description:
    'Signl is editorial intelligence for investors, professionals, founders and analysts. One signal daily. Deep analysis, briefs, and learn tracks — calm, structured, deliberate.',
  applicationName: 'Signl',
  authors: [{ name: 'Signl Media' }],
  keywords: ['macro', 'markets', 'analysis', 'editorial', 'intelligence', 'finance', 'policy'],
  openGraph: {
    type: 'website',
    title: 'Signl',
    description: 'Intelligence-first editorial. One signal daily, before the market reacts.',
    siteName: 'Signl',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signl',
    description: 'Intelligence-first editorial. One signal daily, before the market reacts.',
  },
}

export const viewport: Viewport = {
  themeColor: '#faf8f3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <AuthProvider>
          <BookmarkProvider>
            <ToastProvider>
              <div className="app-shell">
                <Ticker />
                <Navbar />

                <main id="main" className="app-shell-main">
                  {children}
                </main>

                <Footer />
              </div>

              <SearchOverlay />
              <SavedPanel />
            </ToastProvider>
          </BookmarkProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
