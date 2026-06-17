'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const user = useAuthStore((s) => s.user)
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    let current = user
    if (!current && typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      const stored = localStorage.getItem('user')
      if (token && stored) {
        try {
          const parsed = JSON.parse(stored)
          setAuth(parsed, token)
          current = parsed
        } catch {
          /* ignore malformed storage */
        }
      }
    }

    if (!current) {
      router.replace('/login?next=/admin')
      return
    }
    if (current.role !== 'ADMIN') {
      router.replace('/')
      return
    }
    setReady(true)
  }, [user, setAuth, router])

  if (!ready) return null
  return <>{children}</>
}
