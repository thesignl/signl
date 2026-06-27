import Link from 'next/link'
import HeroSidebar from './HeroSidebar'
import Badge from '@/components/ui/Badge'
import type { Article } from '@/types/article'

interface HeroProps {
  article: Article
  supporting?: Article[]
}

export default function Hero({ article, supporting = [] }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-headline">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-lead">
            <div className="hero-tag">
              {article.featured
                ? 'Featured Analysis'
                : article.category?.name ?? "Editor's pick"}
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
                <Badge variant="pro">Pro</Badge>
              ) : null}
            </div>
          </div>

          <HeroSidebar articles={supporting} />
        </div>
      </div>
    </section>
  )
}
