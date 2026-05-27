import './globals.css'

import AuthProvider
from '@/components/common/AuthProvider'
import BookmarkProvider from '@/components/common/BookmarkProvider'

import Navbar
from '@/components/layout/Navbar'
import SearchOverlay from '@/features/search/SearchOverlay'

export default function RootLayout({

  children

}: {

  children: React.ReactNode
}) {

  return (

    <html lang="en">

      <body>

        <AuthProvider>
          
          <BookmarkProvider>

            <SearchOverlay />

            {children}
          
          </BookmarkProvider>

        </AuthProvider>

      </body>

    </html>
  )
}