import { describe, it, expect } from 'vitest'
import {
  prePublishWarnings,
  statePayload,
  emptyEditorState,
} from '@/features/editor/editor.helpers'

describe('prePublishWarnings', () => {
  it('flags empty critical fields on a blank article', () => {
    const w = prePublishWarnings(emptyEditorState())
    expect(w).toContain('Headline is empty.')
    expect(w).toContain('Synopsis is empty — every reader sees this.')
    expect(w).toContain('Signal line is empty.')
  })

  it('flags an enabled-but-empty article depth', () => {
    const s = emptyEditorState()
    s.depths = ['summary', 'article']
    const w = prePublishWarnings(s)
    expect(w).toContain('Article depth is enabled but has no content.')
  })

  it('is clean when everything is filled', () => {
    const s = emptyEditorState()
    s.headline = 'A real headline'
    s.synopsis = 'A real synopsis.'
    s.signal = 'Watch the yield.'
    s.depths = ['summary']
    expect(prePublishWarnings(s)).toHaveLength(0)
  })
})

describe('statePayload', () => {
  it('strips block ids and maps synopsis to summary', () => {
    const s = emptyEditorState()
    s.synopsis = 'Hello world'
    s.blocks = [{ id: 'b1', type: 'paragraph', content: 'Body' }]
    const payload = statePayload(s)
    expect(payload.summary).toBe('Hello world')
    expect(payload.synopsis).toBe('Hello world')
    expect(payload.blocks[0]).not.toHaveProperty('id')
    expect(payload.blocks[0].content).toBe('Body')
  })

  it('passes an empty slug as undefined', () => {
    const s = emptyEditorState()
    expect(statePayload(s).slug).toBeUndefined()
  })
})
