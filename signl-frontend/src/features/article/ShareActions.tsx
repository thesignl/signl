'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

interface ShareActionsProps {
  title: string
  slug: string
}

/**
 * Restrained share affordance: native share where supported,
 * X / LinkedIn intents, and a copy-link button with toast confirmation.
 * No icons-of-shame, no engagement counters, no "share this"-cliche.
 */
export default function ShareActions({ title, slug }: ShareActionsProps) {
  const { toast } = useToast()
  const [busy, setBusy] = useState(false)

  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/article/${slug}`
      : `/article/${slug}`

  const onCopy = async () => {
    try {
      setBusy(true)
      await navigator.clipboard.writeText(url)
      toast('Link copied to clipboard.', 'success')
    } catch {
      toast('Could not copy link.', 'error')
    } finally {
      setBusy(false)
    }
  }

  const onNativeShare = async () => {
    if (typeof navigator === 'undefined' || !('share' in navigator)) {
      onCopy()
      return
    }
    try {
      await (
        navigator as Navigator & {
          share: (data: { title: string; url: string }) => Promise<void>
        }
      ).share({ title, url })
    } catch {
      // user dismissed — silent
    }
  }

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(url)}`
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url,
  )}`

  return (
    <div className="share-actions" role="group" aria-label="Share this article">
      <span className="share-label">Share</span>
      <a
        className="share-action"
        href={xHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        X
      </a>
      <a
        className="share-action"
        href={linkedinHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
      <button
        type="button"
        className="share-action"
        onClick={onCopy}
        disabled={busy}
      >
        Copy link
      </button>
      <button
        type="button"
        className="share-action"
        onClick={onNativeShare}
      >
        Share…
      </button>
    </div>
  )
}
