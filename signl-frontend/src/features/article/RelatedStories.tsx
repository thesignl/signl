import Link from 'next/link'

import { getFeed } from '@/services/article.service'
import type { Article } from '@/types/article'

interface Props {
  currentSlug: string
  category?: string | null
}

/**
 * Server component: pulls the feed and surfaces up to 4 related
 * stories. Same-category preferred; falls back to the most-recent
 * if the category bucket is too thin.
 */
export default async function RelatedStories({ currentSlug, category }: Props) {
  let feed: Article[] = []
  try {
    feed = await getFeed()
  } catch {
    return null
  }

  const others = feed.filter((a) => a.slug !== currentSlug)
  const sameCategory = category
    ? others.filter((a) => a.category?.name === category)
    : []

  const candidates =
    sameCategory.length >= 2
      ? sameCategory
      : [...sameCategory, ...others.filter((a) => !sameCategory.includes(a))]

  const related = candidates.slice(0, 4)
  if (related.length === 0) return null

  return (
    <section className="related-stories" aria-labelledby="related-title">
      <h2 id="related-title" className="related-stories-title">
        Continue reading
      </h2>
      <div className="related-grid">
        {related.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="related-card"
          >
            <div className="related-card-tag">
              {article.category?.name ?? 'Article'}
            </div>
            <h3 className="related-card-headline">{article.title}</h3>
            <div className="related-card-meta">
              {article.author?.name}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
