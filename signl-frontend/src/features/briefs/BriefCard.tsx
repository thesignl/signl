import Link from 'next/link'

import Badge from '@/components/ui/Badge'
import type { Article } from '@/types/article'

export default function BriefCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="brief-card">
      <div className="brief-card-tag">
        <span className="cat">{article.category?.name}</span>
      </div>

      <h3 className="brief-card-headline">{article.title}</h3>
      <p className="brief-card-body">{article.summary}</p>

      <div className="brief-card-footer">
        <span>{article.author?.name}</span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {article.premium ? <Badge variant="pro">Pro</Badge> : null}
        </span>
      </div>
    </Link>
  )
}
