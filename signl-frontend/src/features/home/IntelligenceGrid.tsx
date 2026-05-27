import Link from 'next/link'

import {
  getFeed
}
from '@/services/article.service'

export default async function
IntelligenceGrid() {

  const articles =
    await getFeed()

  const macro =
    articles.filter(

      (a: any) =>

        a.category.name ===
        'Macro'
    )

  const markets =
    articles.filter(

      (a: any) =>

        a.category.name ===
        'Markets'
    )

  return (

    <section className="intel-grid">

      <div className="container">

        <div className="intel-two-col">

          <div>

            <div className="section-header">

              <div className="section-title">

                Macro & Policy

              </div>

            </div>

            {macro.slice(0,3).map(

              (article: any) => (

                <Link

                  key={article.id}

                  href={`/article/${article.slug}`}

                  className="intel-item"
                >

                  <div className="intel-tag">

                    {article.category.name}

                  </div>

                  <div className="intel-headline">

                    {article.title}

                  </div>

                  <div className="intel-summary">

                    {article.summary}

                  </div>

                </Link>
              )
            )}

          </div>

          <div>

            <div className="section-header">

              <div className="section-title">

                Markets & Capital

              </div>

            </div>

            {markets.slice(0,3).map(

              (article: any) => (

                <Link

                  key={article.id}

                  href={`/article/${article.slug}`}

                  className="intel-item"
                >

                  <div className="intel-tag">

                    {article.category.name}

                  </div>

                  <div className="intel-headline">

                    {article.title}

                  </div>

                  <div className="intel-summary">

                    {article.summary}

                  </div>

                </Link>
              )
            )}

          </div>

        </div>

      </div>

    </section>
  )
}