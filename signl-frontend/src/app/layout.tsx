import './globals.css'

import AuthProvider
from '@/components/common/AuthProvider'
import BookmarkProvider from '@/components/common/BookmarkProvider'

import Navbar
from '@/components/layout/Navbar'

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

            {/* <Navbar /> */}

            {children}
          
          </BookmarkProvider>

        </AuthProvider>

      </body>

    </html>
  )
}