import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import Badge from '@/components/ui/Badge'
import BookmarkButton from '@/features/bookmarks/BookmarkButton'
import StoryPaywall from '@/features/article/StoryPaywell'
import StorySignal from '@/features/article/StorySignal'
import StoryContent from '@/features/article/StoryContent'

import { getArticle } from '@/services/article.service'
import type { Article } from '@/types/article'

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let article: Article | null = null
  try {
    article = await getArticle(slug)
  } catch {
    notFound()
  }
  if (!article) notFound()

  const dateLabel = (() => {
    try {
      return new Date(
        article.publishedAt ?? article.createdAt,
      ).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return ''
    }
  })()

  return (
    <article className="story-page">
      <div className="story-container">
        <div className="story-eyebrow">
          <Link href="/analysis" style={{ color: 'inherit' }}>
            {article.category?.name}
          </Link>
        </div>

        <h1 className="story-headline">{article.title}</h1>

        {article.summary ? (
          <div className="synopsis-box" aria-label="Synopsis">
            <div className="synopsis-label">Synopsis</div>
            <p className="synopsis-text">{article.summary}</p>
          </div>
        ) : null}

        <div className="story-meta">
          <span className="byline">{article.author?.name}</span>
          {dateLabel ? (
            <>
              <span className="sep">·</span>
              <span>{dateLabel}</span>
            </>
          ) : null}
          <span className="sep">·</span>
          <span>{article.readTime} min read</span>
          <span className="sep">·</span>
          <span>{article.views?.toLocaleString() ?? 0} views</span>
          {article.verified ? (
            <>
              <span className="sep">·</span>
              <Badge variant="verified">Verified</Badge>
            </>
          ) : null}
          {article.premium ? (
            <>
              <span className="sep">·</span>
              <Badge variant="pro">Pro</Badge>
            </>
          ) : null}
        </div>

        <div className="story-actions">
          <BookmarkButton article={article} />
          <Link href="/" className="btn btn-sm btn-ghost">
            ← Back to home
          </Link>
        </div>

        {article.coverImage ? (
          <div className="story-cover">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              unoptimized
              priority
            />
          </div>
        ) : null}

        <StoryContent
          contentText={article.contentText ?? null}
          blocks={article.blocks}
        />

        {article.signal ? <StorySignal signal={article.signal} /> : null}

        {article.premium ? <StoryPaywall /> : null}
      </div>
    </article>
  )
}
