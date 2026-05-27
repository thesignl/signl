import Link from 'next/link'

export default function
AnalysisCard({

  article

}: {

  article: any
}) {

  return (

    <Link

      href={`/article/${article.slug}`}

      className="
        deep-analysis-card
      "
    >

      <div className="dac-header">

        <div className="dac-label">

          {article.category.name}

          <span>

            {article.articleType}

          </span>

        </div>

        <h2 className="dac-headline">

          {article.title}

        </h2>

        <p className="dac-deck">

          {article.summary}

        </p>

      </div>

      <div className="dac-body">

        <div className="dac-step">

          <div className="dac-step-num">

            STEP 01
          </div>

          <div className="dac-step-label">

            Structural trigger
            identified in policy
            and liquidity systems.
          </div>

        </div>

        <div className="dac-step">

          <div className="dac-step-num">

            STEP 02
          </div>

          <div className="dac-step-label">

            Sector transmission
            pathways mapped.
          </div>

        </div>

        <div className="dac-step">

          <div className="dac-step-num">

            STEP 03
          </div>

          <div className="dac-step-label">

            Capital allocation
            consequences analysed.
          </div>

        </div>

        <div className="dac-step">

          <div className="dac-step-num">

            STEP 04
          </div>

          <div className="dac-step-label">

            Market positioning
            divergence detected.
          </div>

        </div>

        <div className="dac-step">

          <div className="dac-step-num">

            STEP 05
          </div>

          <div className="dac-step-label">

            Strategic signal
            synthesized.
          </div>

        </div>

      </div>

      <div className="dac-footer">

        <div className="dac-footer-meta">

          <span>

            {article.author.name}

          </span>

          <span>

            •

          </span>

          <span>

            {article.readTime}
            {' '}
            min read

          </span>

          <span>

            •

          </span>

          <span>

            {article.views}
            {' '}
            views

          </span>

        </div>

        <button
          className="dac-read-btn"
        >

          Read Analysis

        </button>

      </div>

    </Link>
  )
}