import './globals.css'

import type { Metadata, Viewport } from 'next'
import {
  Source_Serif_4,
  Inter,
  JetBrains_Mono,
} from 'next/font/google'

import AuthProvider from '@/components/common/AuthProvider'
import BookmarkProvider from '@/components/common/BookmarkProvider'
import SubscriptionBootstrap from '@/components/common/SubscriptionBootstrap'
import ToastProvider from '@/components/common/ToastProvider'
import PublicShell from '@/components/layout/PublicShell'

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://signl.media'
const API_URL = process.env.NEXT_PUBLIC_API_URL

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'Signl — Intelligence-first editorial for markets, macro, and systems',
    template: '%s · Signl',
  },
  description:
    'Signl is editorial intelligence for investors, professionals, founders and analysts. One signal daily. Deep analysis, briefs, and learn tracks — calm, structured, deliberate.',
  applicationName: 'Signl',
  authors: [{ name: 'Signl Media' }],
  keywords: [
    'macro',
    'markets',
    'analysis',
    'editorial',
    'intelligence',
    'finance',
    'policy',
  ],
  openGraph: {
    type: 'website',
    title: 'Signl',
    description:
      'Intelligence-first editorial. One signal daily, before the market reacts.',
    siteName: 'Signl',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Signl',
    description:
      'Intelligence-first editorial. One signal daily, before the market reacts.',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf8f3' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0c0b' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
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
      <head>
        {API_URL ? (
          <>
            <link rel="preconnect" href={API_URL} crossOrigin="" />
            <link rel="dns-prefetch" href={API_URL} />
          </>
        ) : null}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <AuthProvider>
          <SubscriptionBootstrap>
            <BookmarkProvider>
              <ToastProvider>
                <PublicShell>
                  {children}
                </PublicShell>
              </ToastProvider>
            </BookmarkProvider>
          </SubscriptionBootstrap>
        </AuthProvider>
      </body>
    </html>
  )
}
