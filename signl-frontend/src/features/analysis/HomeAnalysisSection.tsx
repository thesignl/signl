import Link from 'next/link'

import {
  getAnalysisFeed
}
from '@/services/article.service'

export default async function
HomeAnalysisSection() {

  const articles =
    await getAnalysisFeed()

  const topArticles =
    articles.slice(0, 2)

  return (

    <section
      className="
        home-analysis-strip
      "
    >

      <div className="container">

        <hr className="section-rule" />

        <div className="section-header">

          <div className="section-title">

            Deep Analysis

          </div>

          <Link

            href="/analysis"

            className="section-more"
          >

            View all →

          </Link>

        </div>

        <div className="analysis-grid-2">

          {topArticles.map(

            (article: any) => (

              <Link

                key={article.id}

                href={`/article/${article.slug}`}

                className="analysis-card"
              >

                <div className="ac-label">

                  {article.category.name}

                </div>

                <h2 className="ac-headline">

                  {article.title}

                </h2>

                <p className="ac-deck">

                  {article.summary}

                </p>

                <div className="ac-meta">

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

                </div>

              </Link>
            )
          )}

        </div>

      </div>

    </section>
  )
}