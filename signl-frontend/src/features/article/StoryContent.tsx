import type { ContentBlock } from '@/types/article'

interface BlockContent {
  text?: string
  value?: string
  level?: number
  cite?: string
  src?: string
  alt?: string
  url?: string
}

/**
 * Renders the article body. The Signl API delivers long-form copy
 * either as a single `contentText` string or (eventually) as an
 * ordered list of typed `blocks`. We support both shapes so we can
 * lift the renderer to richer content without churn.
 */
export default function StoryContent({
  contentText,
  blocks,
}: {
  contentText: string | null
  blocks?: ContentBlock[]
}) {
  // Rich-block path
  if (blocks && blocks.length > 0) {
    const sorted = [...blocks].sort((a, b) => a.position - b.position)
    return (
      <div className="story-body">
        {sorted.map((block) => {
          const c = (block.content ?? {}) as BlockContent
          const text = c.text ?? c.value ?? ''
          switch (block.type) {
            case 'TEXT':
              return <p key={block.id}>{text}</p>
            case 'HEADING':
              return <h2 key={block.id}>{text}</h2>
            case 'QUOTE':
              return (
                <blockquote key={block.id}>
                  {text}
                  {c.cite ? (
                    <cite style={{ display: 'block', fontStyle: 'normal' }}>
                      — {c.cite}
                    </cite>
                  ) : null}
                </blockquote>
              )
            default:
              return null
          }
        })}
      </div>
    )
  }

  // Plain-text path: split on blank lines into paragraphs.
  if (contentText && contentText.trim().length > 0) {
    const paragraphs = contentText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
    return (
      <div className="story-body">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    )
  }

  return (
    <div className="story-body-empty">
      The full article will be available shortly. The synopsis above is the
      core of the argument.
    </div>
  )
}
