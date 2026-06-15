import { describe, it, expect } from 'vitest'
import {
  buildContentBlocks,
  decodeContentBlocks,
  buildAnalysisSteps,
  decodeAnalysisSteps,
  META_KIND,
} from '../editor.mapper.js'

describe('editor.mapper · content blocks', () => {
  const state = {
    deck: 'A view from the desk.',
    summaryPoints: ['Point one', 'Point two'],
    depths: ['summary', 'article', 'analysis'],
    blocks: [
      { type: 'paragraph' as const, content: 'Opening paragraph.' },
      { type: 'heading' as const, content: 'A section' },
      { type: 'quote' as const, content: 'A quote', cite: '— Someone' },
      {
        type: 'datatable' as const,
        content: '',
        data: [
          ['Metric', 'Q4'],
          ['Margin', '3.4%'],
        ],
      },
    ],
    analysisBlocks: [
      { type: 'paragraph' as const, content: 'Analysis body prose.' },
    ],
  }

  it('puts a non-rendered meta carrier first', () => {
    const rows = buildContentBlocks(state)
    expect((rows[0].content as any).kind).toBe(META_KIND)
    expect(rows[0].type).toBe('EMBED')
  })

  it('round-trips deck, summaryPoints and depths', () => {
    const rows = buildContentBlocks(state)
    const { meta } = decodeContentBlocks(rows)
    expect(meta.deck).toBe(state.deck)
    expect(meta.summaryPoints).toEqual(state.summaryPoints)
    expect(meta.depths).toEqual(state.depths)
  })

  it('round-trips article blocks losslessly including quote cite', () => {
    const rows = buildContentBlocks(state)
    const { blocks } = decodeContentBlocks(rows)
    expect(blocks.map((b) => b.type)).toEqual([
      'paragraph',
      'heading',
      'quote',
      'datatable',
    ])
    expect(blocks[2].cite).toBe('— Someone')
    expect(blocks[3].data).toEqual([
      ['Metric', 'Q4'],
      ['Margin', '3.4%'],
    ])
  })

  it('separates analysis-surface blocks from article-surface blocks', () => {
    const rows = buildContentBlocks(state)
    const { blocks, analysisBlocks } = decodeContentBlocks(rows)
    expect(blocks).toHaveLength(4)
    expect(analysisBlocks).toHaveLength(1)
    expect(analysisBlocks[0].content).toBe('Analysis body prose.')
  })

  it('maps article prose to reader-renderable Prisma types', () => {
    const rows = buildContentBlocks(state)
    // row order: meta, paragraph(TEXT), heading(HEADING), quote(QUOTE), datatable(EMBED), analysis(EMBED)
    expect(rows[1].type).toBe('TEXT')
    expect(rows[2].type).toBe('HEADING')
    expect(rows[3].type).toBe('QUOTE')
    expect(rows[4].type).toBe('EMBED')
  })
})

describe('editor.mapper · analysis steps', () => {
  it('round-trips the five-step framework', () => {
    const steps = [
      { label: 'Catalyst', text: 'What changed.' },
      { label: 'Context', text: 'The system.' },
      { label: 'Transmission', text: 'How it spreads.' },
      { label: 'Outlook', text: 'What we expect.' },
      { label: 'Signal', text: 'What to watch.' },
    ]
    const rows = buildAnalysisSteps(steps)
    expect(rows).toHaveLength(5)
    expect(rows[0].stepNumber).toBe(1)

    const decoded = decodeAnalysisSteps(
      rows.map((r) => ({
        title: r.title,
        description: r.description,
        stepNumber: r.stepNumber,
      })),
    )
    expect(decoded[0].label).toBe('Catalyst')
    expect(decoded[0].num).toBe('01')
    expect(decoded[4].text).toBe('What to watch.')
  })
})
