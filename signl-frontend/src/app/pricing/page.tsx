'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import PlanCard from '@/features/pricing/PlanCard'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/auth.store'
import { useSubscriptionStore } from '@/store/subscription.store'
import { getPlans, checkout, verifyPayment, getSubscriptionStatus } from '@/services/subscription.service'
import { useRazorpay } from '@/hooks/useRazorpay'
import type { PlanDefinition } from '@/types/subscription'

export default function PricingPage() {
  const [plans, setPlans] = useState<PlanDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  const user = useAuthStore((s) => s.user)
  const currentPlan = useSubscriptionStore((s) => s.plan)
  const setSubscription = useSubscriptionStore((s) => s.setSubscription)
  const { toast } = useToast()
  const router = useRouter()
  const { loaded: razorpayLoaded, openCheckout } = useRazorpay()

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setLoading(false))
  }, [])

  const handleUpgrade = async () => {
    if (!user) {
      router.push('/login?next=/pricing')
      return
    }
    if (!razorpayLoaded) {
      toast('Payment system is loading. Please try again in a moment.', 'info')
      return
    }

    setUpgrading(true)

    let orderData: Awaited<ReturnType<typeof checkout>>
    try {
      orderData = await checkout('PRO')
    } catch (err: any) {
      setUpgrading(false)
      toast(err?.response?.data?.message ?? 'Could not initiate checkout.', 'error')
      return
    }

    try {
      openCheckout({
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: 'Signl',
        description: 'Signl Pro — Monthly Access',
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            const status = await getSubscriptionStatus()
            setSubscription({ ...status, loading: false })
            toast('Welcome to Signl Pro!', 'success')
            router.push('/account/subscription')
          } catch {
            setUpgrading(false)
            toast('Payment received but activation failed. Please contact support.', 'error')
          }
        },
        modal: {
          ondismiss: () => setUpgrading(false),
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#b8392b',
        },
      })
    } catch {
      setUpgrading(false)
      toast('Failed to open checkout. Please try again.', 'error')
    }
  }

  const free = plans.find((p) => p.id === 'FREE')
  const pro = plans.find((p) => p.id === 'PRO')
  const isAlreadyPro = currentPlan === 'PRO'

  return (
    <div className="pricing-page">
      <div className="pricing-hero">
        <div className="pricing-eyebrow">Pricing</div>
        <h1 className="pricing-headline">Intelligence without limits</h1>
        <p className="pricing-sub">
          Deep research, exclusive signals, and premium analysis — for investors,
          founders, and analysts who think in systems.
        </p>
      </div>

      {loading ? (
        <div className="plan-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height={32} width="60%" />
            <Skeleton height={20} width="40%" />
            <Skeleton height={360} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Skeleton height={32} width="60%" />
            <Skeleton height={20} width="40%" />
            <Skeleton height={360} />
          </div>
        </div>
      ) : (
        <div className="plan-grid">
          {free && (
            <PlanCard
              plan={free}
              cta={
                user && isAlreadyPro ? (
                  <div className="btn btn-md btn-secondary plan-cta-btn">
                    Included in Pro
                  </div>
                ) : user ? (
                  <Link
                    href="/account/subscription"
                    className="btn btn-md btn-secondary plan-cta-btn"
                  >
                    Your current plan
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="btn btn-md btn-secondary plan-cta-btn"
                  >
                    Get started free
                  </Link>
                )
              }
            />
          )}
          {pro && (
            <PlanCard
              plan={pro}
              highlighted
              cta={
                isAlreadyPro ? (
                  <Link
                    href="/account/subscription"
                    className="btn btn-md btn-primary plan-cta-btn"
                  >
                    Manage subscription
                  </Link>
                ) : (
                  <Button
                    variant="accent"
                    size="md"
                    loading={upgrading}
                    onClick={handleUpgrade}
                    className="plan-cta-btn"
                  >
                    {user ? 'Upgrade to Pro' : 'Start with Pro'}
                  </Button>
                )
              }
            />
          )}
        </div>
      )}

      <p className="pricing-note">
        Cancel anytime · No contracts · Billed monthly
      </p>
    </div>
  )
}
