import { create } from 'zustand'
import type { SubscriptionStatus } from '@/types/subscription'

interface SubscriptionStore {
  plan: string | null
  status: SubscriptionStatus | null
  subscribed: boolean
  startedAt: string | null
  expiresAt: string | null
  cancelledAt: string | null
  loading: boolean
  setSubscription: (data: Partial<{
    plan: string | null
    status: SubscriptionStatus | null
    subscribed: boolean
    startedAt: string | null
    expiresAt: string | null
    cancelledAt: string | null
    loading: boolean
  }>) => void
  reset: () => void
}

const initialState = {
  plan: null,
  status: null,
  subscribed: false,
  startedAt: null,
  expiresAt: null,
  cancelledAt: null,
  loading: false,
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  ...initialState,
  setSubscription: (data) => set(data),
  reset: () => set(initialState),
}))
