import Link from 'next/link'

export default function StoryPaywall() {
  return (
    <aside className="premium-wall" aria-labelledby="paywall-title">
      <div className="pw-label">Signl Pro</div>
      <h2 id="paywall-title" className="pw-headline">
        Continue reading premium analysis
      </h2>
      <p className="pw-sub">
        Deeper research, frameworks and operational insight — calibrated for
        investors, founders and analysts who think in systems.
      </p>
      <Link href="/signup" className="btn btn-lg btn-accent">
        Start free trial
      </Link>
      <div className="pw-note">₹499 / month · cancel anytime</div>
    </aside>
  )
}
