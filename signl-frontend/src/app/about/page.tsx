import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Signl is intelligence-first editorial — calm, structured, deliberate. We write for investors, professionals, founders and the intellectually curious.',
}

export default function AboutPage() {
  return (
    <>
      <header className="page-header-dark">
        <div className="container">
          <div className="page-eyebrow">About Signl</div>
          <h1 className="page-title">
            Intelligence, calmly distilled. Before the market reacts.
          </h1>
          <p className="page-sub">
            Signl is an editorial product for investors, operators, analysts
            and the intellectually curious — a place where deep analysis,
            briefs and learn tracks live in one calm, deliberate space.
          </p>
        </div>
      </header>

      <section className="story-page" style={{ paddingTop: 0 }}>
        <div className="story-container">
          <div className="story-body">
            <p>
              Markets, macro and policy move every minute. The signal does
              not. We exist for the readers who would rather understand a
              system than chase a headline — investors, founders, operators,
              and policy-aware professionals who think in years, not ticks.
            </p>
            <h2>What we publish</h2>
            <p>
              <strong>Analysis</strong> — long-form pieces that decompose a
              policy shift, capital flow, or structural change into a
              framework you can reuse. <strong>Briefs</strong> — five-minute
              reads that capture a single point of view with the receipts.
              <strong> Learn</strong> — durable tracks that build the
              foundations behind the news, for readers new to a domain.
            </p>
            <h2>How we write</h2>
            <p>
              Plain language. Numbers where they matter. One signal at the
              bottom of every story. No churn, no hot takes, no theatre.
            </p>
            <h2>Who reads us</h2>
            <p>
              Allocators, founders, operators, researchers, students of macro,
              and the financially curious. Beginners are welcome — but the
              standard never drops to meet them; the writing rises to meet
              everyone.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
