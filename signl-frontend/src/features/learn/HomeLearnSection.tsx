import Link from 'next/link'
import type { Article } from '@/types/article'

/**
 * 3-up Learn teaser used on the homepage. Replaces the previous
 * pattern of rendering the entire /learn route inside /.
 */
export default function HomeLearnSection({
  articles,
}: {
  articles: Article[]
}) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="home-learn-strip" aria-labelledby="home-learn-title">
      <div className="container">
        <div className="section-header">
          <h2 id="home-learn-title" className="section-title">
            Learn
          </h2>
          <Link href="/learn" className="section-more">
            All tracks →
          </Link>
        </div>

        <div className="learn-strip-grid">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="learn-strip-card"
            >
              <div className="learn-strip-eyebrow">
                {article.category?.name ?? 'Track'}
              </div>
              <h3 className="learn-strip-title">{article.title}</h3>
              <div className="learn-strip-meta">
                {article.author?.name}
                {article.readTime ? ` · ${article.readTime} min read` : ''}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
