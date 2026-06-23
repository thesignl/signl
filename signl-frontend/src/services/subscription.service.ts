import api from '@/lib/axios'
import type { SubscriptionState } from '@/types/subscription'

export async function getSubscriptionStatus(): Promise<SubscriptionState> {
  const res = await api.get('/subscription/status')
  return res.data.data
}
