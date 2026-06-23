import Link from 'next/link'

interface Props {
  paywalled: boolean
}

export default function StoryPaywall({ paywalled }: Props) {
  if (!paywalled) {
    return (
      <div className="pw-subscribed" role="note">
        <span aria-hidden>★</span>
        <span>You&apos;re reading a Signl Pro article — full access active.</span>
      </div>
    )
  }

  return (
    <aside className="premium-wall" aria-labelledby="paywall-title">
      <div className="pw-lock" aria-hidden>🔒</div>
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
