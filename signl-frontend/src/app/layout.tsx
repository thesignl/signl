import './globals.css'

import Ticker
from '@/app/components/layout/Ticker'

import Navbar
from '@/app/components/layout/Navbar'

import SectionNav
from '@/app/components/layout/SectionNav'

import Footer
from '@/app/components/layout/Footer'

export default function RootLayout({

  children

}: {

  children: React.ReactNode

}) {

  return (

    <html lang="en">

      <body>

        <Ticker />

        <Navbar />

        <SectionNav />

        {children}

        <Footer />

      </body>

    </html>
  )
}