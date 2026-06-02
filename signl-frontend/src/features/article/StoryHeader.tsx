import type { Article } from '@/types/article'

/**
 * Retained for callers that still consume the standalone header.
 * The article page itself now composes header + meta inline, so this
 * file remains as a stable export for future story-page variants.
 */
export default function StoryHeader({ article }: { article: Article }) {
  const dateLabel = (() => {
    try {
      return new Date(article.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return ''
    }
  })()

  return (
    <>
      <div className="story-eyebrow">{article.category?.name}</div>
      <h1 className="story-headline">{article.title}</h1>

      {article.summary ? (
        <div className="synopsis-box">
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
      </div>
    </>
  )
}
