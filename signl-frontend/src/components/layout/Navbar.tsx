'use client'

import Link from 'next/link'

import {
  useAuthStore
}
from '@/store/auth.store'
import { useSearchStore } from '@/store/search.store'

export default function Navbar() {

  const {

    user,
    logout

  } = useAuthStore()

  const openSearch =
  useSearchStore(
    state => state.openSearch
  )

  return (

    <nav>

      <Link
        href="/"
        className="nav-logo"
      >

        SIGNL<span>.</span>

      </Link>



      <div className="nav-right">

        {!user ? (

          <>

            <button

              className="icon-btn"

              onClick={openSearch}
            >

              🔍

            </button>

            <Link
              href="/login"
              className="btn-ghost"
            >

              Sign in

            </Link>
            
            <Link
              href="/signup"
              className="btn-ghost"
            >

              Sign up

            </Link>

            <Link
              href="/newsletter"
              className="btn-primary"
            >

              Subscribe

            </Link>

          </>

        ) : (

          <>

            <span>

              {user.name}

            </span>

            <button
              className="btn-ghost"
              onClick={logout}
            >

              Logout

            </button>

          </>

        )}

      </div>

    </nav>
  )
}