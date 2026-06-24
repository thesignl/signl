'use client'

import { useState } from 'react'
import Link from 'next/link'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { useSubscriptionStore } from '@/store/subscription.store'
import { cancelSubscription, getSubscriptionStatus } from '@/services/subscription.service'
import CancelDialog from '@/features/account/CancelDialog'

function fmtDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function SubscriptionPage() {
  const { plan, status, startedAt, expiresAt, cancelledAt, loading, setSubscription } =
    useSubscriptionStore()
  const { toast } = useToast()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const isPro = plan === 'PRO'
  const isActive = status === 'ACTIVE'
  const isCancelled = status === 'CANCELLED'
  const inGracePeriod =
    isCancelled &&
    expiresAt != null &&
    new Date(expiresAt) > new Date()

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const result = await cancelSubscription()
      toast(
        `Subscription cancelled. Access continues until ${fmtDate(result.accessUntil)}.`,
        'success',
      )
      setDialogOpen(false)
      const fresh = await getSubscriptionStatus()
      setSubscription({ ...fresh, loading: false })
    } catch (err: any) {
      toast(
        err?.response?.data?.message ?? 'Could not cancel. Please try again.',
        'error',
      )
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="acct-page">
        <div className="acct-page-header">
          <Skeleton height={28} width={200} />
        </div>
        <div className="acct-card">
          <div style={{ marginBottom: 16 }}>
            <Skeleton height={14} width={100} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Skeleton height={16} width="80%" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Skeleton height={16} width="60%" />
          </div>
          <Skeleton height={16} width="70%" />
        </div>
      </div>
    )
  }

  return (
    <div className="acct-page">
      <div className="acct-page-header">
        <h1 className="acct-page-title">Subscription</h1>
      </div>

      <div className="acct-card">
        <div className="acct-card-head">
          <div className="acct-card-label">Current plan</div>
          <Badge variant={isPro ? 'pro' : 'free'}>
            {isPro ? 'Pro' : 'Free'}
          </Badge>
        </div>

        {isPro ? (
          <div className="acct-row-group">
            <div className="acct-row">
              <span className="acct-row-label">Status</span>
              <span className={`sub-status-pill sub-status-${status?.toLowerCase()}`}>
                {isActive ? 'Active' : isCancelled ? 'Cancelled' : status}
              </span>
            </div>
            {startedAt && (
              <div className="acct-row">
                <span className="acct-row-label">Started</span>
                <span className="acct-row-value">{fmtDate(startedAt)}</span>
              </div>
            )}
            <div className="acct-row">
              <span className="acct-row-label">
                {isCancelled ? 'Access until' : 'Renews'}
              </span>
              <span className="acct-row-value">{fmtDate(expiresAt)}</span>
            </div>
            {cancelledAt && (
              <div className="acct-row">
                <span className="acct-row-label">Cancelled on</span>
                <span className="acct-row-value">{fmtDate(cancelledAt)}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="acct-plan-desc">
            You are on the Free plan. Upgrade to Signl Pro for premium articles,
            exclusive signals, and deep analysis — for investors, founders, and
            analysts who think in systems.
          </p>
        )}

        <div className="acct-card-actions">
          {!isPro && (
            <Link href="/pricing" className="btn btn-md btn-accent">
              Upgrade to Pro
            </Link>
          )}
          {isPro && isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              Cancel subscription
            </Button>
          )}
          {isPro && isCancelled && (
            <Link href="/pricing" className="btn btn-sm btn-secondary">
              Resubscribe
            </Link>
          )}
        </div>
      </div>

      {isPro && isCancelled && inGracePeriod && (
        <div className="acct-notice acct-notice--info">
          Your subscription is cancelled. You retain full Pro access until{' '}
          <strong>{fmtDate(expiresAt)}</strong>. After that date, your account
          returns to the Free plan.
        </div>
      )}

      <CancelDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleCancel}
        confirming={cancelling}
        accessUntil={expiresAt}
      />
    </div>
  )
}
