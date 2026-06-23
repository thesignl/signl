import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import type { Article } from '@/types/article'

export default function LearnCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="learn-card">
      <div className="learn-card-top">
        <span className="art-tag">{article.category?.name ?? 'Track'}</span>
        {article.premium ? <Badge variant="pro">Pro</Badge> : null}
      </div>

      <h2 className="learn-card-title">{article.title}</h2>
      <p className="learn-card-summary">{article.summary}</p>

      <div className="learn-card-meta">
        <span>{article.author?.name}</span>
        <span>·</span>
        <span>{article.readTime} min read</span>
      </div>
    </Link>
  )
}
