import Link from 'next/link'

import BriefCard from './BriefCard'
import { getBriefArticles } from '@/services/article.service'
import type { Article } from '@/types/article'

export default async function HomeBriefSection() {
  const articles = await getBriefArticles().catch(() => [] as Article[])
  const briefs = articles
    .filter((a) => a.articleType === 'BRIEF')
    .slice(0, 3)

  if (briefs.length === 0) return null

  return (
    <section className="home-brief-strip" aria-labelledby="home-briefs-title">
      <div className="container">
        <div className="section-header">
          <h2 id="home-briefs-title" className="section-title">
            Quick Briefs
          </h2>
          <Link href="/analysis" className="section-more">
            View all →
          </Link>
        </div>

        <div className="brief-scroll">
          {briefs.map((article) => (
            <BriefCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
