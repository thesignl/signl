'use client'

import Link from 'next/link'

export default function AnalysisError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-eyebrow">Analysis unavailable</div>
        <h1 className="error-title">The analysis feed is paused.</h1>
        <p className="error-desc">
          We couldn’t load the analysis index. Please try again — your saved
          articles and the rest of Signl remain available.
        </p>
        <div className="error-actions">
          <button
            type="button"
            onClick={reset}
            className="btn btn-md btn-primary"
          >
            Retry
          </button>
          <Link href="/" className="btn btn-md btn-secondary">
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}
