'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
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
      router.replace('/login?next=/admin')
      return
    }
    if (current.role !== 'ADMIN') {
      router.replace('/')
      return
    }
    setReady(true)
  }, [user, hydrate, router])

  if (!ready) return null
  return <>{children}</>
}
