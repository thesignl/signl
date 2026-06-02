'use client'

import Link from 'next/link'

export default function LearnError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-eyebrow">Learn unavailable</div>
        <h1 className="error-title">The Learn library is paused.</h1>
        <p className="error-desc">
          We couldn’t load the tracks. Try again, or browse Analysis while we
          recover.
        </p>
        <div className="error-actions">
          <button
            type="button"
            onClick={reset}
            className="btn btn-md btn-primary"
          >
            Retry
          </button>
          <Link href="/analysis" className="btn btn-md btn-secondary">
            Analysis
          </Link>
        </div>
      </div>
    </div>
  )
}
