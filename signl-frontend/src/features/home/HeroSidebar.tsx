import Link from 'next/link'
import type { Article } from '@/types/article'

/**
 * 3-up supporting stories rail next to the hero. Receives a slice
 * of the feed (no extra fetch). Renders nothing if empty so the
 * layout reflows cleanly on small breakpoints.
 */
export default function HeroSidebar({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null
  return (
    <aside className="hero-sidebar" aria-label="More featured stories">
      {articles.slice(0, 3).map((article) => (
        <Link
          key={article.id}
          href={`/article/${article.slug}`}
          className="hero-sidebar-item"
        >
          <div className="hs-top">
            <span className="hs-tag">{article.category?.name ?? 'Article'}</span>
          </div>
          <h3 className="hs-headline">{article.title}</h3>
          <span className="hs-meta">
            {article.author?.name}
          </span>
        </Link>
      ))}
    </aside>
  )
}
