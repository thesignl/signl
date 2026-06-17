'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Ticker from '@/components/layout/Ticker'
import SearchOverlay from '@/features/search/SearchOverlay'
import SavedPanel from '@/features/bookmarks/SavedPanel'

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>
  }

  return (
    <>
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
    </>
  )
}
