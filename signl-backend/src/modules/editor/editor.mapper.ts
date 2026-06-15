import type { BlockType } from '@prisma/client'

/**
 * Editor ⇄ schema mapping.
 *
 * The reference editor models content the reader's Prisma schema does not have
 * dedicated columns for (deck, summary teaser points, active depths, data
 * tables, and a separate Pro-only "analysis body"). Per the hard constraint we
 * make ZERO schema changes. Instead we encode that data losslessly inside the
 * existing `ContentBlock.content` JSON column:
 *
 *   - article-surface prose   → real TEXT / HEADING / QUOTE blocks
 *                               (rendered by the existing reader)
 *   - data tables             → EMBED block { kind: 'datatable', ... }
 *   - analysis-surface body   → EMBED block { kind: 'analysis-block', ... }
 *   - editor meta             → EMBED block { kind: 'signl:meta', deck,
 *                               summaryPoints, depths }
 *
 * The reader's StoryContent renders only TEXT/HEADING/QUOTE and returns null for
 * everything else, so the EMBED carrier blocks are invisible to readers — no
 * regression — while remaining fully recoverable by the editor.
 */

export const META_KIND = 'signl:meta'

export type EditorBlock = {
  id?: string
  type: 'paragraph' | 'heading' | 'quote' | 'datatable'
  content?: string
  cite?: string
  cols?: number
  rows?: number
  data?: string[][]
}

export type EditorStepInput = {
  id?: string
  num?: string
  label?: string
  text?: string
}

const REF_TO_PRISMA: Record<EditorBlock['type'], BlockType> = {
  paragraph: 'TEXT',
  heading: 'HEADING',
  quote: 'QUOTE',
  datatable: 'EMBED',
}

/** Build the ordered ContentBlock create-rows for an article from editor state. */
export function buildContentBlocks(state: {
  deck?: string
  summaryPoints?: string[]
  depths?: string[]
  blocks?: EditorBlock[]
  analysisBlocks?: EditorBlock[]
}) {
  const rows: { type: BlockType; content: unknown; position: number }[] = []
  let position = 0

  // 1) Meta carrier — always first, never rendered by the reader.
  rows.push({
    type: 'EMBED',
    position: position++,
    content: {
      kind: META_KIND,
      deck: state.deck ?? '',
      summaryPoints: (state.summaryPoints ?? []).filter(
        (p) => typeof p === 'string',
      ),
      depths: state.depths ?? ['summary'],
    },
  })

  // 2) Article-surface blocks — real renderable blocks.
  for (const b of state.blocks ?? []) {
    rows.push({
      type: REF_TO_PRISMA[b.type] ?? 'TEXT',
      position: position++,
      content: encodeBlock(b, 'article'),
    })
  }

  // 3) Analysis-surface body — carried as EMBED, invisible to the reader.
  for (const b of state.analysisBlocks ?? []) {
    rows.push({
      type: 'EMBED',
      position: position++,
      content: { ...encodeBlock(b, 'analysis'), kind: 'analysis-block' },
    })
  }

  return rows
}

function encodeBlock(b: EditorBlock, surface: 'article' | 'analysis') {
  const base: Record<string, unknown> = {
    refType: b.type,
    surface,
    text: b.content ?? '',
  }
  if (b.type === 'quote') base.cite = b.cite ?? ''
  if (b.type === 'datatable') {
    base.kind = 'datatable'
    base.data = Array.isArray(b.data) ? b.data : []
    base.cols = b.cols ?? b.data?.[0]?.length ?? 3
    base.rows = b.rows ?? b.data?.length ?? 3
  }
  return base
}

/** Decode persisted ContentBlocks back into the editor's content shape. */
export function decodeContentBlocks(
  blocks: { type: BlockType; content: unknown; position: number }[],
) {
  const meta = {
    deck: '',
    summaryPoints: [] as string[],
    depths: ['summary'] as string[],
  }
  const articleBlocks: EditorBlock[] = []
  const analysisBlocks: EditorBlock[] = []

  const sorted = [...blocks].sort((a, b) => a.position - b.position)

  for (const row of sorted) {
    const c = (row.content ?? {}) as Record<string, unknown>

    if (c.kind === META_KIND) {
      meta.deck = String(c.deck ?? '')
      meta.summaryPoints = Array.isArray(c.summaryPoints)
        ? (c.summaryPoints as string[])
        : []
      meta.depths = Array.isArray(c.depths)
        ? (c.depths as string[])
        : ['summary']
      continue
    }

    const decoded = decodeBlock(row)
    if (c.kind === 'analysis-block' || c.surface === 'analysis') {
      analysisBlocks.push(decoded)
    } else {
      articleBlocks.push(decoded)
    }
  }

  return { meta, blocks: articleBlocks, analysisBlocks }
}

function decodeBlock(row: { type: BlockType; content: unknown }): EditorBlock {
  const c = (row.content ?? {}) as Record<string, unknown>
  const refType =
    (c.refType as EditorBlock['type']) ??
    (c.kind === 'datatable' ? 'datatable' : prismaToRef(row.type))

  const block: EditorBlock = {
    type: refType,
    content: String(c.text ?? c.value ?? ''),
  }
  if (refType === 'quote') block.cite = String(c.cite ?? '')
  if (refType === 'datatable') {
    block.data = Array.isArray(c.data) ? (c.data as string[][]) : []
    block.cols =
      typeof c.cols === 'number' ? c.cols : block.data?.[0]?.length ?? 3
    block.rows = typeof c.rows === 'number' ? c.rows : block.data?.length ?? 3
  }
  return block
}

function prismaToRef(t: BlockType): EditorBlock['type'] {
  switch (t) {
    case 'HEADING':
      return 'heading'
    case 'QUOTE':
      return 'quote'
    default:
      return 'paragraph'
  }
}

/** Map editor framework steps → AnalysisStep create rows. */
export function buildAnalysisSteps(steps: EditorStepInput[] = []) {
  return steps.map((s, i) => ({
    title: s.label?.trim() || `Step ${i + 1}`,
    description: s.text ?? '',
    stepNumber: i + 1,
  }))
}

/** Decode AnalysisStep rows → editor framework steps. */
export function decodeAnalysisSteps(
  steps: {
    title: string
    description: string | null
    stepNumber: number
  }[] = [],
) {
  return [...steps]
    .sort((a, b) => a.stepNumber - b.stepNumber)
    .map((s) => ({
      num: String(s.stepNumber).padStart(2, '0'),
      label: s.title,
      text: s.description ?? '',
    }))
}
