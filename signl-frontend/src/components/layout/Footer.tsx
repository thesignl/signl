import Link from 'next/link'

export default function
Footer() {

  return (

    <footer className="footer">

      <div className="container">

        <div className="footer-top">

          <div className="footer-brand">

            <div className="footer-logo">

              SIGNL

            </div>

            <p className="footer-copy">

              Intelligence-first
              editorial platform
              for markets, macro,
              geopolitics and systems.

            </p>

          </div>

          <div className="footer-links">

            <div className="footer-column">

              <div className="footer-heading">

                Sections

              </div>

              <Link href="/analysis">

                Analysis

              </Link>

              <Link href="/briefs">

                Briefs

              </Link>

              <Link href="/markets">

                Markets

              </Link>

            </div>

            <div className="footer-column">

              <div className="footer-heading">

                Company

              </div>

              <Link href="/about">

                About

              </Link>

              <Link href="/careers">

                Careers

              </Link>

              <Link href="/contact">

                Contact

              </Link>

            </div>

            <div className="footer-column">

              <div className="footer-heading">

                Social

              </div>

              <a href="#">

                X / Twitter

              </a>

              <a href="#">

                LinkedIn

              </a>

              <a href="#">

                Instagram

              </a>

            </div>

          </div>

        </div>

        <div className="footer-bottom">

          © 2026 SIGNL Media.
          All rights reserved.

        </div>

      </div>

    </footer>
  )
}