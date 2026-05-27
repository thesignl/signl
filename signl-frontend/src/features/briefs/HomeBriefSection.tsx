import Link from 'next/link'
import BriefCard from './BriefCard'
import { getBriefArticles } from '@/services/article.service'
import { Article } from '@/types/article'

export default async function
HomeBriefSection() {

  const articles = await getBriefArticles()


  const briefs =
    articles.filter(

      (
        article : Article
      ) =>

        article.articleType ===
        'BRIEF'
    )

  if (
    briefs.length === 0
  ) {
    return null
  }

  return (

    <section className="home-brief-strip">

      <div className="container">

        <hr className="section-rule" />

        <div className="section-header">

          <div className="section-title">

            Quick Briefs

          </div>

          <Link

            href="/briefs"

            className="section-more"
          >

            View all →

          </Link>

        </div>

        <div className="brief-scroll">

          {briefs.slice(0,3).map(

            (
              article : Article
            ) => (

              <BriefCard

                key={article.id}

                article={article}

                className="brief-card"
              />

            )
          )}

        </div>

      </div>

    </section>
  )
}