import { describe, it, expect } from 'vitest'
import {
  slugify,
  countAllWords,
  estReadTime,
  isDepthEmpty,
  fmtCount,
  emptyEditorState,
  listStatusOf,
  defaultAnalysisSteps,
} from '@/features/editor/editor.helpers'

describe('slugify', () => {
  it('lowercases, strips punctuation, hyphenates', () => {
    expect(slugify("The RBI's silent tightening!")).toBe(
      'the-rbis-silent-tightening',
    )
  })
  it('caps at 60 chars', () => {
    expect(slugify('a'.repeat(80)).length).toBe(60)
  })
})

describe('word count + read time', () => {
  it('counts across all surfaces', () => {
    const s = emptyEditorState()
    s.synopsis = 'one two three'
    s.summaryPoints = ['four five', '']
    s.blocks = [{ id: 'b', type: 'paragraph', content: 'six seven eight' }]
    expect(countAllWords(s)).toBe(8)
  })
  it('uses 220wpm with a 1-minute floor', () => {
    const s = emptyEditorState()
    s.blocks = [
      { id: 'b', type: 'paragraph', content: Array(440).fill('w').join(' ') },
    ]
    expect(estReadTime(s)).toBe(2)
  })
  it('honors a manual readTime override', () => {
    const s = emptyEditorState()
    s.readTime = 9
    expect(estReadTime(s)).toBe(9)
  })
})

describe('isDepthEmpty', () => {
  it('summary empty when no synopsis or points', () => {
    const s = emptyEditorState()
    expect(isDepthEmpty(s, 'summary')).toBe(true)
    s.synopsis = 'hello'
    expect(isDepthEmpty(s, 'summary')).toBe(false)
  })
  it('article empty when blocks are blank', () => {
    const s = emptyEditorState()
    expect(isDepthEmpty(s, 'article')).toBe(true)
    s.blocks = [{ id: 'b', type: 'paragraph', content: 'words' }]
    expect(isDepthEmpty(s, 'article')).toBe(false)
  })
})

describe('fmtCount', () => {
  it('formats thousands', () => {
    expect(fmtCount(412)).toBe('412')
    expect(fmtCount(4980)).toBe('5.0k')
    expect(fmtCount(14820)).toBe('15k')
  })
})

describe('listStatusOf', () => {
  it('treats future publishAt on a draft as SCHEDULED', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    expect(listStatusOf({ status: 'DRAFT', publishAt: future })).toBe(
      'SCHEDULED',
    )
  })
  it('keeps PUBLISHED as PUBLISHED even with publishAt', () => {
    const future = new Date(Date.now() + 86_400_000).toISOString()
    expect(listStatusOf({ status: 'PUBLISHED', publishAt: future })).toBe(
      'PUBLISHED',
    )
  })
  it('passes through DRAFT without a schedule', () => {
    expect(listStatusOf({ status: 'DRAFT' })).toBe('DRAFT')
  })
})

describe('defaultAnalysisSteps', () => {
  it('returns the five framework steps in order', () => {
    const steps = defaultAnalysisSteps()
    expect(steps.map((s) => s.label)).toEqual([
      'Catalyst',
      'Context',
      'Transmission',
      'Outlook',
      'Signal',
    ])
    expect(steps[0].num).toBe('01')
  })
})
