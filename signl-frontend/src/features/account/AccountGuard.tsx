'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function AccountGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
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
          // ignore malformed storage
        }
      }
    }

    if (!current) {
      router.replace(`/login?next=${encodeURIComponent(pathname ?? '/account/subscription')}`)
      return
    }
    setReady(true)
  }, [user, setAuth, router, pathname])

  if (!ready) return null
  return <>{children}</>
}
