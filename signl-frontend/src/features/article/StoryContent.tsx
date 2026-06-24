import type { ContentBlock } from '@/types/article'

interface BlockContent {
  text?: string
  value?: string
  level?: number
  cite?: string
  src?: string
  alt?: string
  url?: string
  kind?: string
  data?: string[][]
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

          // Data tables are encoded as EMBED/IMAGE blocks with kind:'datatable'.
          // Render them as real tables so editor-created tables aren't dropped.
          if (c.kind === 'datatable' && Array.isArray(c.data) && c.data.length > 0) {
            const rows = c.data
            const [head, ...body] = rows
            return (
              <div key={block.id} className="story-table-wrap">
                <table className="story-table">
                  {head ? (
                    <thead>
                      <tr>
                        {head.map((cell, i) => (
                          <th key={i}>{cell}</th>
                        ))}
                      </tr>
                    </thead>
                  ) : null}
                  <tbody>
                    {body.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, ci) => (
                          <td key={ci}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }

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
            case 'CODE':
              return (
                <pre key={block.id} className="story-code">
                  <code>{text}</code>
                </pre>
              )
            case 'LIST':
              return (
                <ul key={block.id} className="story-list">
                  {text
                    .split('\n')
                    .map((l) => l.trim())
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                </ul>
              )
            default:
              // Unknown/empty block with text still renders as a paragraph
              // rather than silently vanishing.
              return text ? <p key={block.id}>{text}</p> : null
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
