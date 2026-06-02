'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('[Signl] route error', error)
    }
  }, [error])

  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-eyebrow">Something interrupted</div>
        <h1 className="error-title">We couldn’t load this section.</h1>
        <p className="error-desc">
          A transient issue prevented the page from rendering. Try again, or
          return home — your saved articles are unaffected.
        </p>
        <div className="error-actions">
          <button
            type="button"
            onClick={reset}
            className="btn btn-md btn-primary"
          >
            Try again
          </button>
          <Link href="/" className="btn btn-md btn-secondary">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
