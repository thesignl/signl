'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

/**
 * Guards editor routes. Hydrates auth from localStorage on mount, then ensures
 * the user is an EDITOR or ADMIN. Returns `ready` once the check has run so
 * pages can avoid flashing protected content.
 */
export function useEditorGuard() {
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
      router.replace('/login?next=/editor')
      return
    }
    if (current.role !== 'EDITOR' && current.role !== 'ADMIN') {
      router.replace('/')
      return
    }
    setReady(true)
  }, [user, setAuth, router])

  return { ready, user }
}
