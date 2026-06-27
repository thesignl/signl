'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function AccountGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
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
      router.replace(`/login?next=${encodeURIComponent(pathname ?? '/account/subscription')}`)
      return
    }
    // One-shot guard gate: flips `ready` once the auth check passes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true)
  }, [user, hydrate, router, pathname])

  if (!ready) return null
  return <>{children}</>
}
