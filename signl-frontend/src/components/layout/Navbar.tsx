'use client'

import Link from 'next/link'

import {
  useAuthStore
}
from '@/store/auth.store'

export default function Navbar() {

  const {

    user,
    logout

  } = useAuthStore()

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

            <Link
              href="/login"
              className="btn-ghost"
            >

              Sign in

            </Link>

            <Link
              href="/signup"
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