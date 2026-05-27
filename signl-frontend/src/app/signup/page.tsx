'use client'

import { useState }
from 'react'

import { useRouter }
from 'next/navigation'

import {
  signupUser
}
from '@/services/auth.service'

export default function SignupPage() {

  const router = useRouter()

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const handleSignup =
  async () => {

    try {

      await signupUser(

        name,
        email,
        password
      )

      alert('Account created')

      router.push('/login')

    } catch {

      alert('Signup failed')
    }
  }

  return (

    <main className="story-page">

      <div className="story-container">

        <h1 className="story-headline">

          Create your SIGNL account

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
            placeholder="Name"
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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
            onClick={handleSignup}
          >

            Create Account

          </button>

        </div>

      </div>

    </main>
  )
}