import Image from 'next/image'
import Link from 'next/link'

import Badge from '@/components/ui/Badge'
import BookmarkButton from '@/features/bookmarks/BookmarkButton'
import type { Article } from '@/types/article'

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function ArticleCard({ article }: { article: Article }) {
  const initial = article.category?.name?.charAt(0)?.toUpperCase() ?? 'S'

  return (
    <Link href={`/article/${article.slug}`} className="article-item">
      <div>
        <div className="art-meta-top">
          <span className="art-tag">{article.category?.name}</span>
          {article.premium ? <Badge variant="pro">Pro</Badge> : null}
          {article.verified ? <Badge variant="verified">Verified</Badge> : null}
        </div>

        <h2 className="art-headline">{article.title}</h2>
        <p className="art-deck">{article.summary}</p>

        <div className="art-meta">
          <span>{article.author?.name}</span>
          <span className="sep">·</span>
          <span>{formatDate(article.publishedAt ?? article.createdAt)}</span>
          <span style={{ marginLeft: 'auto' }}>
            <BookmarkButton article={article} variant="compact" />
          </span>
        </div>
      </div>

      <div className="art-thumb" aria-hidden>
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt=""
            width={280}
            height={210}
            unoptimized
          />
        ) : (
          <span className="art-thumb-placeholder">{initial}</span>
        )}
      </div>
    </Link>
  )
}
