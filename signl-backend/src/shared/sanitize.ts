import sanitizeHtml from 'sanitize-html'

/**
 * Sanitizes editor-produced HTML before it touches the database.
 *
 * Allowlist policy:
 * - Structural: h1, h2, h3, p, br, hr
 * - Inline: strong, em, u, s, code
 * - Lists: ul, ol, li
 * - Quotes: blockquote
 * - Links: a (href whitelisted to http/https/mailto, forced rel="noopener nofollow")
 * - Images: img with safe src schemes only
 *
 * Everything else (script, style, iframe, on* attrs, javascript: URLs, etc.)
 * is stripped. This is the single source of truth for what HTML can land in
 * the database — never persist raw editor output without running this first.
 */
const POLICY: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'p', 'br', 'hr',
    'strong', 'em', 'u', 's', 'code', 'pre',
    'blockquote',
    'ul', 'ol', 'li',
    'a', 'img',
    'figure', 'figcaption',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel', 'target'],
    img: ['src', 'alt', 'title', 'width', 'height'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data'],
  },
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  transformTags: {
    // Every external link is forced safe: no opener, no follow.
    a: (tagName, attribs) => ({
      tagName: 'a',
      attribs: {
        ...attribs,
        rel: 'noopener nofollow',
        target: '_blank',
      },
    }),
  },
}

export function sanitizeArticleHtml(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return ''
  return sanitizeHtml(input, POLICY)
}

/**
 * Extracts a plain-text representation from sanitized HTML.
 * Used for: full-text search, SEO description fallback, paywall truncation.
 * Collapses whitespace and inserts double newlines between block elements
 * so paragraph structure survives at least as readable text.
 */
export function htmlToPlainText(html: string | null | undefined): string {
  if (!html) return ''
  // Insert paragraph breaks for block-level closes BEFORE stripping tags.
  const withBreaks = html
    .replace(/<\/(p|h1|h2|h3|li|blockquote|pre|hr)>/gi, '$&\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
  // Strip remaining tags (the source HTML has already been sanitized, so
  // there are no dangerous tags to worry about — this is for text extraction).
  const stripped = sanitizeHtml(withBreaks, { allowedTags: [], allowedAttributes: {} })
  // Collapse runs of whitespace and trim.
  return stripped.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}
