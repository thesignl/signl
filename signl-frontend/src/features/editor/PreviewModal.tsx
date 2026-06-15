'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor.store'
import { countAllWords, estReadTime } from './editor.helpers'
import type { Depth, EditorBlock } from '@/types/editor'

function BlockView({ block }: { block: EditorBlock }) {
  if (block.type === 'heading') return <h3>{block.content}</h3>
  if (block.type === 'quote')
    return (
      <blockquote>
        {block.content}
        {block.cite ? (
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--ink-4)',
              marginTop: 8,
              fontStyle: 'normal',
              letterSpacing: '.04em',
            }}
          >
            {block.cite}
          </div>
        ) : null}
      </blockquote>
    )
  if (block.type === 'datatable' && block.data?.length)
    return (
      <table className="ed-preview-table">
        <tbody>
          {block.data.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) =>
                r === 0 ? (
                  <th key={c}>{cell}</th>
                ) : (
                  <td key={c}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    )
  return <p>{block.content}</p>
}

/** Reader-faithful preview with per-depth switching. */
export default function PreviewModal({
  categoryName,
  authorName,
  onClose,
}: {
  categoryName: string
  authorName: string
  onClose: () => void
}) {
  const state = useEditorStore((s) => s.state)
  const [depth, setDepth] = useState<Depth>(state?.activeDepth ?? 'summary')
  if (!state) return null

  const bodyDepth: Depth =
    depth === 'analysis' && state.depths.includes('analysis')
      ? 'analysis'
      : state.depths.includes('article') && depth !== 'summary'
        ? 'article'
        : 'summary'

  return (
    <div className="ed-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ed-modal lg">
        <div className="ed-modal-head" style={{ padding: '14px 22px' }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-4)',
              }}
            >
              Preview · viewing as
            </div>
            <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
              {(['summary', 'article', 'analysis'] as Depth[])
                .filter((d) => state.depths.includes(d))
                .map((d) => (
                  <button
                    key={d}
                    className={`ed-filter-chip${bodyDepth === d ? ' active' : ''}`}
                    onClick={() => setDepth(d)}
                  >
                    {d[0].toUpperCase() + d.slice(1)}
                  </button>
                ))}
            </div>
          </div>
          <button className="ed-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="ed-modal-body ed-preview-body">
          <div className="ed-preview-container">
            <div className="ed-preview-eyebrow">{categoryName}</div>
            <h1 className="ed-preview-headline">
              {state.headline || 'Your headline will appear here'}
            </h1>
            {state.deck ? <div className="ed-preview-deck">{state.deck}</div> : null}

            <div className="ed-preview-synopsis">
              <div className="ed-preview-synopsis-label">Synopsis</div>
              <div className="ed-preview-synopsis-text">
                {state.synopsis || 'Your synopsis will appear here'}
              </div>
            </div>

            <div className="ed-preview-meta">
              By {authorName} · {estReadTime(state)} min read ·{' '}
              {countAllWords(state)} words
            </div>

            {bodyDepth !== 'summary' && state.depths.includes('article') ? (
              <div className="ed-preview-text">
                {state.blocks.map((b) => (
                  <BlockView key={b.id} block={b} />
                ))}
              </div>
            ) : null}

            {bodyDepth === 'analysis' && state.depths.includes('analysis') ? (
              <>
                <hr className="ed-preview-signal-rule" />
                <div
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 10.5,
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: 14,
                    fontWeight: 500,
                  }}
                >
                  The Signl Framework
                </div>
                {state.analysisSteps.map((s, i) => (
                  <div className="ed-preview-framework-row" key={i}>
                    <div className="ed-preview-framework-label">
                      {s.num} · {s.label}
                    </div>
                    <div className="ed-preview-framework-text">{s.text}</div>
                  </div>
                ))}
                <div className="ed-preview-text" style={{ marginTop: 24 }}>
                  {state.analysisBlocks.map((b) => (
                    <BlockView key={b.id} block={b} />
                  ))}
                </div>
              </>
            ) : null}

            {state.signal ? (
              <>
                <hr className="ed-preview-signal-rule" />
                <div className="ed-preview-signal">
                  <strong>▶ Watch: </strong>
                  {state.signal}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="ed-modal-foot">
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10.5,
              color: 'var(--ink-4)',
              flex: 1,
            }}
          >
            This is what readers see at the <strong>{bodyDepth}</strong> depth.
          </span>
          <button className="ed-btn ed-btn-ghost" onClick={onClose}>
            Back to editor
          </button>
        </div>
      </div>
    </div>
  )
}
