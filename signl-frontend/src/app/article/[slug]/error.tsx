'use client'

import Link from 'next/link'

export default function ArticleError({
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-eyebrow">Article unavailable</div>
        <h1 className="error-title">We couldn’t load this story.</h1>
        <p className="error-desc">
          The article may have been moved, or the request couldn’t reach our
          editorial servers. Please try again.
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
            Browse home
          </Link>
        </div>
      </div>
    </div>
  )
}
