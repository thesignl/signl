'use client'

import { useState }
from 'react'

import { useRouter }
from 'next/navigation'

import {
  loginUser
}
from '@/services/auth.service'

import {
  useAuthStore
}
from '@/store/auth.store'

export default function LoginPage() {

  const router = useRouter()

  const setAuth =
    useAuthStore(
      state => state.setAuth
    )

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const handleLogin =
  async () => {

    try {

      const response =
        await loginUser(

          email,
          password
        )

      setAuth(

        response.data.user,

        response.data.token
      )

      router.push('/')

    } catch {

      alert('Login failed')
    }
  }

  return (

    <main className="story-page">

      <div className="story-container">

        <h1 className="story-headline">

          Welcome back to SIGNL

        </h1>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '32px'
          }}
        >

          <input
            placeholder="Email"
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            className="btn-primary"
            onClick={handleLogin}
          >

            Login

          </button>

        </div>

      </div>

    </main>
  )
}