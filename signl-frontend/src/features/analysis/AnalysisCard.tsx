import Link from 'next/link'
import type { Article } from '@/types/article'

export default function AnalysisCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="deep-analysis-card">
      <div className="dac-header">
        <div className="dac-label">
          <span>{article.category?.name}</span>
          <span className="type">{article.articleType}</span>
        </div>
        <h2 className="dac-headline">{article.title}</h2>
        <p className="dac-deck">{article.summary}</p>
      </div>

      <div className="dac-footer">
        <div className="dac-footer-meta">
          <span>{article.author?.name}</span>
        </div>
        <span
          className="btn btn-sm btn-ghost"
          style={{ pointerEvents: 'none' }}
          aria-hidden
        >
          Read analysis →
        </span>
      </div>
    </Link>
  )
}
