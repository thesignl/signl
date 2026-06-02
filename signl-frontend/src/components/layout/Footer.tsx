import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" aria-labelledby="footer-heading">
      <div className="container">
        <h2 id="footer-heading" className="sr-only" style={{ position: 'absolute', left: -10000 }}>
          Site footer
        </h2>

        <div className="footer-top">
          <div>
            <div className="footer-logo">
              Signl<span>.</span>
            </div>
            <p className="footer-tagline">
              Intelligence-first editorial. One signal daily — for investors,
              operators, analysts and the intellectually curious.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <div className="footer-heading">Read</div>
              <Link href="/">Home</Link>
              <Link href="/analysis">Analysis</Link>
              <Link href="/learn">Learn</Link>
            </div>

            <div className="footer-column">
              <div className="footer-heading">Company</div>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>

            <div className="footer-column">
              <div className="footer-heading">Account</div>
              <Link href="/signup">Get started</Link>
              <Link href="/login">Sign in</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} Signl Media. All rights reserved.</span>
          <span>Calm intelligence, before the market reacts.</span>
        </div>
      </div>
    </footer>
  )
}
