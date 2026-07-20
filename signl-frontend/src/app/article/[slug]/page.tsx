import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import Badge from '@/components/ui/Badge'
import BookmarkButton from '@/features/bookmarks/BookmarkButton'
import StoryPaywall from '@/features/article/StoryPaywell'
import StorySignal from '@/features/article/StorySignal'
import StoryContent from '@/features/article/StoryContent'
import ReadingProgress from '@/features/article/ReadingProgress'
import ShareActions from '@/features/article/ShareActions'
import RelatedStories from '@/features/article/RelatedStories'
import PremiumBanner from '@/features/article/PremiumBanner'

import { getArticle } from '@/services/article.service'
import type { Article } from '@/types/article'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const article: Article | null = await getArticle(slug)
    if (!article) return { title: 'Article not found' }
    return {
      title: article.title,
      description: article.summary,
      openGraph: {
        title: article.title,
        description: article.summary,
        type: 'article',
        images: article.coverImage ? [{ url: article.coverImage }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
      },
    }
  } catch {
    return { title: 'Article' }
  }
}

export default async function ArticlePage({ params }: PageProps) {
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
      <ReadingProgress />

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

        {article.premium ? <PremiumBanner /> : null}

        {article.paywalled ? (
          <div className="pw-gate">
            <p className="pw-teaser-label" aria-label="Reading preview">
              Reading preview
            </p>
            <StoryContent
              contentText={article.contentText ?? null}
              contentHtml={article.contentHtml ?? null}
              blocks={article.blocks}
            />
            <div className="pw-fade" aria-hidden />
          </div>
        ) : (
          <StoryContent
            contentText={article.contentText ?? null}
            contentHtml={article.contentHtml ?? null}
            blocks={article.blocks}
          />
        )}

        {!article.paywalled && article.signal ? (
          <StorySignal signal={article.signal} />
        ) : null}

        {!article.paywalled ? (
          <ShareActions title={article.title} slug={article.slug} />
        ) : null}

        {article.premium ? (
          <StoryPaywall paywalled={article.paywalled ?? false} />
        ) : null}

        <RelatedStories
          currentSlug={article.slug}
          category={article.category?.name}
        />
      </div>
    </article>
  )
}
