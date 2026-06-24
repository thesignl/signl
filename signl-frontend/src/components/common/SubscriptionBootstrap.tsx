'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useSubscriptionStore } from '@/store/subscription.store'
import { getSubscriptionStatus } from '@/services/subscription.service'

export default function SubscriptionBootstrap({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useAuthStore((s) => s.user)
  const setSubscription = useSubscriptionStore((s) => s.setSubscription)
  const reset = useSubscriptionStore((s) => s.reset)

  useEffect(() => {
    if (!user) {
      reset()
      return
    }
    setSubscription({ loading: true })
    let cancelled = false
    getSubscriptionStatus()
      .then((data) => {
        if (cancelled) return
        setSubscription({
          plan: data.plan,
          status: data.status,
          subscribed: data.subscribed,
          startedAt: data.startedAt,
          expiresAt: data.expiresAt,
          cancelledAt: data.cancelledAt,
          loading: false,
        })
      })
      .catch(() => {
        if (!cancelled) setSubscription({ loading: false })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return <>{children}</>
}
