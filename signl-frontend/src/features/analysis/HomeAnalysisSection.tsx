import Link from 'next/link'

import { getAnalysisFeed } from '@/services/article.service'
import type { Article } from '@/types/article'

export default async function HomeAnalysisSection() {
  const articles = await getAnalysisFeed().catch(() => [] as Article[])
  const top = articles.slice(0, 2)
  if (top.length === 0) return null

  return (
    <section className="home-analysis-strip" aria-labelledby="home-analysis-title">
      <div className="container">
        <div className="section-header">
          <h2 id="home-analysis-title" className="section-title">
            Deep Analysis
          </h2>
          <Link href="/analysis" className="section-more">
            View all →
          </Link>
        </div>

        <div className="analysis-grid-2">
          {top.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="analysis-card-dark"
            >
              <div className="ac-label">{article.category?.name}</div>
              <h3 className="ac-headline">{article.title}</h3>
              <p className="ac-deck">{article.summary}</p>
              <div className="ac-meta">
                <span>{article.author?.name}</span>
                <span>·</span>
                <span>{article.readTime} min read</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
