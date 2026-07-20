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
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    let current = user
    if (!current) {
      hydrate()
      current = useAuthStore.getState().user
    }

    if (!current) {
      router.replace('/login?next=/editor')
      return
    }
    if (current.role !== 'EDITOR' && current.role !== 'ADMIN') {
      router.replace('/')
      return
    }
    // One-shot guard gate: flips `ready` exactly once after the auth check
    // passes. Not a cascading render — deps are stable post-hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true)
  }, [user, hydrate, router])

  return { ready, user }
}
