import api from '@/lib/axios'
import type {
  SubscriptionState,
  PlanDefinition,
  CheckoutResult,
  CancelResult,
  VerifyPaymentInput,
} from '@/types/subscription'

export async function getSubscriptionStatus(): Promise<SubscriptionState> {
  const res = await api.get('/subscription/status')
  return res.data.data
}

export async function getPlans(): Promise<PlanDefinition[]> {
  const res = await api.get('/subscription/plans')
  return res.data.data
}

export async function checkout(plan: 'PRO'): Promise<CheckoutResult> {
  const res = await api.post('/subscription/checkout', { plan })
  return res.data.data
}

export async function cancelSubscription(): Promise<CancelResult> {
  const res = await api.post('/subscription/cancel')
  return res.data.data
}

export async function verifyPayment(data: VerifyPaymentInput): Promise<{ verified: boolean }> {
  const res = await api.post('/subscription/verify', data)
  return res.data.data
}
