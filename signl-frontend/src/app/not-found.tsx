import Link from 'next/link'

export const metadata = {
  title: 'Not found',
}

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-card">
        <div className="error-eyebrow">404</div>
        <h1 className="error-title">Nothing here.</h1>
        <p className="error-desc">
          The page you’re looking for moved, was retired, or never existed. Try
          one of these instead.
        </p>
        <div className="error-actions">
          <Link href="/" className="btn btn-md btn-primary">
            Home
          </Link>
          <Link href="/analysis" className="btn btn-md btn-secondary">
            Analysis
          </Link>
          <Link href="/learn" className="btn btn-md btn-ghost">
            Learn
          </Link>
        </div>
      </div>
    </div>
  )
}
