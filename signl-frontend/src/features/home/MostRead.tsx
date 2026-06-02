import Link from 'next/link'
import type { Article } from '@/types/article'

/**
 * Optional sidebar widget (currently unused on home — kept for the
 * /analysis right-rail). Receives articles to avoid an extra fetch.
 */
export default function MostRead({ articles = [] }: { articles?: Article[] }) {
  const sorted = [...articles].sort((a, b) => b.views - a.views).slice(0, 5)
  if (sorted.length === 0) return null

  return (
    <aside aria-label="Most read">
      <div className="section-header">
        <div className="section-title">Most read</div>
      </div>
      <div className="article-stack">
        {sorted.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="article-item"
          >
            <div>
              <div className="art-meta-top">
                <span className="art-tag">
                  {String(index + 1).padStart(2, '0')} ·{' '}
                  {article.category?.name}
                </span>
              </div>
              <h3 className="art-headline" style={{ fontSize: 16 }}>
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}
