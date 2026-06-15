import type {
  AnalysisStep,
  Depth,
  EditorArticle,
  EditorBlock,
  EditorState,
  ListStatus,
} from '@/types/editor'

/** URL-safe slug from a headline (matches the reference + backend slugify). */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

const countWords = (s: string | undefined) =>
  s && s.trim() ? s.trim().split(/\s+/).length : 0

/** Total word count across every composable surface. */
export function countAllWords(state: EditorState): number {
  let n = countWords(state.synopsis)
  state.summaryPoints.forEach((p) => (n += countWords(p)))
  state.blocks.forEach((b) => (n += countWords(b.content)))
  state.analysisBlocks.forEach((b) => (n += countWords(b.content)))
  state.analysisSteps.forEach((s) => (n += countWords(s.text)))
  return n
}

/** Estimated read time in minutes (220 wpm), honoring a manual override. */
export function estReadTime(state: EditorState): number {
  if (state.readTime > 0) return state.readTime
  return Math.max(1, Math.round(countAllWords(state) / 220))
}

/** Whether a given depth has no meaningful content yet. */
export function isDepthEmpty(state: EditorState, depth: Depth): boolean {
  if (depth === 'summary')
    return !state.synopsis.trim() && !state.summaryPoints.some((p) => p.trim())
  if (depth === 'article') return !state.blocks.some((b) => b.content.trim())
  if (depth === 'analysis')
    return (
      !state.analysisSteps.some((s) => s.text.trim()) &&
      !state.analysisBlocks.some((b) => b.content.trim())
    )
  return true
}

/** Number formatter — 14820 → "15k", 4980 → "5k", 412 → "412". */
export function fmtCount(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'k' : String(n)
}

let blockSeq = 0
export function newBlockId(): string {
  blockSeq += 1
  return `b${Date.now()}-${blockSeq}`
}

export function makeBlock(type: EditorBlock['type']): EditorBlock {
  const block: EditorBlock = { id: newBlockId(), type, content: '' }
  if (type === 'quote') block.cite = ''
  if (type === 'datatable') {
    block.cols = 3
    block.rows = 3
    block.data = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]
  }
  return block
}

export const FRAMEWORK_LABELS = [
  'Catalyst',
  'Context',
  'Transmission',
  'Outlook',
  'Signal',
] as const

export function defaultAnalysisSteps(): AnalysisStep[] {
  return FRAMEWORK_LABELS.map((label, i) => ({
    num: String(i + 1).padStart(2, '0'),
    label,
    text: '',
  }))
}

/** Derive the list-facing status: a future publishAt means "Scheduled". */
export function listStatusOf(article: {
  status: string
  publishAt?: string
}): ListStatus {
  if (
    article.status !== 'PUBLISHED' &&
    article.publishAt &&
    new Date(article.publishAt).getTime() > Date.now()
  ) {
    return 'SCHEDULED'
  }
  return article.status as ListStatus
}

/** Build a fresh editor state for a brand-new article. */
export function emptyEditorState(
  defaults: { categoryId?: string; authorId?: string } = {},
): EditorState {
  return {
    id: '',
    isNew: true,
    headline: '',
    deck: '',
    signal: '',
    depths: ['summary', 'article'],
    activeDepth: 'summary',
    synopsis: '',
    summaryPoints: ['', ''],
    blocks: [makeBlock('paragraph')],
    analysisSteps: defaultAnalysisSteps(),
    analysisBlocks: [makeBlock('paragraph')],
    categoryId: defaults.categoryId ?? '',
    authorId: defaults.authorId ?? '',
    slug: '',
    tags: [],
    premium: false,
    featured: false,
    coverImage: '',
    seoTitle: '',
    seoDescription: '',
    readTime: 0,
    status: 'DRAFT',
    publishAt: '',
  }
}

/** Hydrate editor state from a fetched article. */
export function stateFromArticle(a: EditorArticle): EditorState {
  const depths: Depth[] = a.depths?.length ? a.depths : ['summary']
  return {
    id: a.id,
    isNew: false,
    headline: a.headline ?? '',
    deck: a.deck ?? '',
    signal: a.signal ?? '',
    depths,
    activeDepth: depths[0] ?? 'summary',
    synopsis: a.synopsis ?? a.summary ?? '',
    summaryPoints: a.summaryPoints?.length ? a.summaryPoints : ['', ''],
    blocks: a.blocks?.length
      ? a.blocks.map(withId)
      : [makeBlock('paragraph')],
    analysisSteps: a.analysisSteps?.length
      ? a.analysisSteps
      : defaultAnalysisSteps(),
    analysisBlocks: a.analysisBlocks?.length
      ? a.analysisBlocks.map(withId)
      : [makeBlock('paragraph')],
    categoryId: a.categoryId ?? '',
    authorId: a.authorId ?? '',
    slug: a.slug ?? '',
    tags: a.tags ?? [],
    premium: a.premium,
    featured: a.featured,
    coverImage: a.coverImage ?? '',
    seoTitle: a.seoTitle ?? '',
    seoDescription: a.seoDescription ?? '',
    readTime: a.readTime ?? 0,
    status: a.status,
    publishAt: a.publishAt ?? '',
  }
}

function withId(b: EditorBlock): EditorBlock {
  return b.id ? b : { ...b, id: newBlockId() }
}

/** Serialize editor state into the PATCH payload the backend expects. */
export function statePayload(state: EditorState) {
  return {
    headline: state.headline,
    summary: state.synopsis,
    synopsis: state.synopsis,
    deck: state.deck,
    signal: state.signal,
    slug: state.slug || undefined,
    coverImage: state.coverImage,
    premium: state.premium,
    featured: state.featured,
    status: state.status,
    readTime: state.readTime,
    publishAt: state.publishAt || null,
    seoTitle: state.seoTitle,
    seoDescription: state.seoDescription,
    categoryId: state.categoryId || undefined,
    authorId: state.authorId || undefined,
    depths: state.depths,
    summaryPoints: state.summaryPoints,
    blocks: state.blocks.map(stripId),
    analysisBlocks: state.analysisBlocks.map(stripId),
    analysisSteps: state.analysisSteps,
    tags: state.tags,
  }
}

function stripId(b: EditorBlock) {
  return {
    type: b.type,
    content: b.content,
    cite: b.cite,
    cols: b.cols,
    rows: b.rows,
    data: b.data,
  }
}

/** Warnings shown before publishing — empty critical fields / enabled-empty depths. */
export function prePublishWarnings(state: EditorState): string[] {
  const w: string[] = []
  if (!state.headline.trim()) w.push('Headline is empty.')
  if (!state.synopsis.trim())
    w.push('Synopsis is empty — every reader sees this.')
  if (state.depths.includes('article') && isDepthEmpty(state, 'article'))
    w.push('Article depth is enabled but has no content.')
  if (state.depths.includes('analysis') && isDepthEmpty(state, 'analysis'))
    w.push('Analysis depth is enabled but has no framework or body.')
  if (!state.signal.trim()) w.push('Signal line is empty.')
  return w
}
