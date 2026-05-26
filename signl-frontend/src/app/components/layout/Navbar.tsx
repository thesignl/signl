'use client'

import Link from 'next/link'

export default function Navbar() {

  return (

    <nav>

      <Link
        href="/"
        className="nav-logo"
      >
        SIGNL<span>.</span>
      </Link>

      <div className="nav-right">

        <button className="icon-btn">

          🔍

        </button>

        <button className="btn-ghost">

          Sign in

        </button>

        <button className="btn-primary">

          Subscribe

        </button>

      </div>

    </nav>
  )
}