import Link from 'next/link'
import type { Article } from '@/types/article'

interface Props {
  /** When provided, no extra request is made. */
  articles?: Article[]
}

export default function IntelligenceGrid({ articles = [] }: Props) {
  // Bucket by category name. Matches the actual category names used in the
  // product ("Macro and Policy", "Market and Capital") with tolerant fallbacks
  // so the section still works if a category is renamed or abbreviated.
  const inBucket = (a: Article, keys: string[]) => {
    const name = a.category?.name?.toLowerCase() ?? ''
    return keys.some((k) => name.includes(k))
  }
  const macro = articles.filter((a) => inBucket(a, ['macro', 'policy'])).slice(0, 3)
  const markets = articles
    .filter((a) => inBucket(a, ['market', 'capital']))
    .slice(0, 3)

  if (macro.length === 0 && markets.length === 0) return null

  const renderColumn = (
    title: string,
    items: Article[],
    headingId: string,
  ) => (
    <div>
      <div className="section-header">
        <h2 id={headingId} className="section-title">
          {title}
        </h2>
      </div>
      <div className="article-stack">
        {items.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="article-item"
          >
            <div>
              <div className="art-meta-top">
                <span className="art-tag">{article.category?.name}</span>
              </div>
              <h3 className="art-headline">{article.title}</h3>
              <p className="art-deck">{article.summary}</p>
              <div className="art-meta">
                <span>{article.author?.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <section
      className="home-feed"
      style={{ paddingTop: 0 }}
      aria-label="Macro and Markets"
    >
      <div className="container">
        <div
          className={
            macro.length && markets.length
              ? 'intelligence-grid intelligence-grid--two'
              : 'intelligence-grid'
          }
        >
          {macro.length > 0 ? renderColumn('Macro & Policy', macro, 'macro-h') : null}
          {markets.length > 0 ? renderColumn('Markets & Capital', markets, 'markets-h') : null}
        </div>
      </div>
    </section>
  )
}
