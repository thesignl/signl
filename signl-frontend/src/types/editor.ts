/**
 * Editor types — mirror the backend `serializeForEditor` contract
 * (signl-backend/src/modules/editor/editor.service.ts). The editor speaks in
 * reference-editor vocabulary (headline, deck, depths, blocks, analysisSteps);
 * the backend mapper translates this to/from the existing Prisma schema with no
 * schema migration.
 */

export type ArticleType = 'ARTICLE' | 'ANALYSIS' | 'BRIEF' | 'LEARN'

/** Statuses the editor can set. The backend has no SCHEDULED enum — a future
 * `publishAt` on a DRAFT/REVIEW item is what the UI surfaces as "Scheduled". */
export type EditorStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'

/** Virtual status used only by the list UI (derived, never sent to the API). */
export type ListStatus = EditorStatus | 'SCHEDULED'

export type Depth = 'summary' | 'article' | 'analysis'

export type BlockType = 'paragraph' | 'heading' | 'quote' | 'datatable'

export interface EditorBlock {
  id: string
  type: BlockType
  content: string
  cite?: string
  cols?: number
  rows?: number
  data?: string[][]
}

export interface AnalysisStep {
  id?: string
  num: string
  label: string
  text: string
}

export interface EditorCategory {
  id: string
  name: string
  slug?: string | null
}

export interface EditorAuthor {
  id: string
  name: string
  title?: string | null
}

/** The single editor state object (mirrors the reference `E`). */
export interface EditorState {
  id: string
  isNew: boolean

  headline: string
  deck: string
  signal: string

  depths: Depth[]
  activeDepth: Depth

  synopsis: string
  summaryPoints: string[]

  blocks: EditorBlock[]
  analysisSteps: AnalysisStep[]
  analysisBlocks: EditorBlock[]

  categoryId: string
  authorId: string
  slug: string
  tags: string[]

  premium: boolean
  featured: boolean
  coverImage: string
  seoTitle: string
  seoDescription: string
  readTime: number

  status: EditorStatus
  publishAt: string
}

/** Shape returned by GET /editor/:id and /editor/drafts (backend serializer). */
export interface EditorArticle {
  id: string
  headline: string
  deck: string
  summary: string
  synopsis: string
  // Universal editor (post-refactor). Null/empty on legacy block articles.
  subheading?: string
  contentHtml?: string
  contentJson?: unknown
  summaryPoints: string[]
  depths: Depth[]
  signal: string
  slug: string
  coverImage: string
  premium: boolean
  featured: boolean
  verified: boolean
  articleType: ArticleType
  status: EditorStatus
  readTime: number
  views: number
  saves?: number
  readThrough?: number
  publishAt: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
  categoryId: string
  authorId: string
  category: EditorCategory | null
  author: EditorAuthor | null
  tags: string[]
  blocks: EditorBlock[]
  analysisBlocks: EditorBlock[]
  analysisSteps: AnalysisStep[]
  updatedAt: string
  createdAt: string
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
