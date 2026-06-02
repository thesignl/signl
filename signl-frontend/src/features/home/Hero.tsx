import Link from 'next/link'
import type { Article } from '@/types/article'

export default function Hero({ article }: { article: Article }) {
  return (
    <section className="hero" aria-labelledby="hero-headline">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-lead">
            <div className="hero-tag">
              {article.featured ? 'Featured Analysis' : article.category?.name ?? 'Editor’s pick'}
            </div>

            <h1 id="hero-headline" className="hero-headline">
              <Link href={`/article/${article.slug}`}>{article.title}</Link>
            </h1>

            <p className="hero-deck">{article.summary}</p>

            <div className="hero-meta">
              <span>{article.author?.name}</span>
              <span className="sep">·</span>
              <span>{article.readTime} min read</span>
              {article.verified ? (
                <>
                  <span className="sep">·</span>
                  <span>Verified</span>
                </>
              ) : null}
              {article.premium ? (
                <>
                  <span className="sep">·</span>
                  <span>Pro</span>
                </>
              ) : null}
            </div>
          </div>

          {/* Reserved for future: 3-up sidebar of supporting stories.
              Hidden gracefully on mobile via the .hero-grid responsive rule. */}
        </div>
      </div>
    </section>
  )
}
