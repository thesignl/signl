'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor.store'
import {
  countAllWords,
  estReadTime,
  prePublishWarnings,
} from './editor.helpers'
import { DepthChips } from './EditorBits'

/** Publish confirmation with pre-publish warnings + now/schedule choice. */
export default function PublishModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void
  onConfirm: () => void
}) {
  const state = useEditorStore((s) => s.state)
  // Snapshot "now" once at mount so the render stays pure across re-renders.
  const [now] = useState(() => Date.now())
  if (!state) return null

  const warnings = prePublishWarnings(state)
  const isUpdate = state.status === 'PUBLISHED'
  const isScheduled =
    !!state.publishAt && new Date(state.publishAt).getTime() > now

  return (
    <div className="ed-modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ed-modal">
        <div className="ed-modal-head">
          <div className="ed-modal-title">
            {isUpdate ? 'Update published article' : 'Publish to SIGNL'}
          </div>
          <button className="ed-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="ed-modal-body">
          <div
            style={{
              background: 'var(--paper-2)',
              padding: '14px 16px',
              borderRadius: 6,
              borderLeft: '3px solid var(--accent)',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 6,
              }}
            >
              {state.premium ? 'Pro article' : 'Free article'}
            </div>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 15.5,
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {state.headline || '(no headline)'}
            </div>
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <DepthChips depths={state.depths} />
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10.5,
                  color: 'var(--ink-4)',
                  marginLeft: 6,
                }}
              >
                {countAllWords(state)} words · {estReadTime(state)} min
              </span>
            </div>
          </div>

          {warnings.length > 0 ? (
            <div
              style={{
                background: 'var(--accent-amber-soft)',
                border: '1px solid #f0e0a8',
                borderRadius: 6,
                padding: '12px 14px',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-amber)',
                  marginBottom: 7,
                  fontWeight: 600,
                }}
              >
                ⚠ Before you publish
              </div>
              {warnings.map((wn) => (
                <div
                  key={wn}
                  style={{
                    fontSize: 12.5,
                    color: 'var(--ink-2)',
                    lineHeight: 1.5,
                    padding: '3px 0',
                  }}
                >
                  • {wn}
                </div>
              ))}
            </div>
          ) : null}

          {isScheduled ? (
            <p
              style={{
                fontSize: 12.5,
                color: 'var(--ink-3)',
                lineHeight: 1.5,
              }}
            >
              Scheduled for{' '}
              <strong>{new Date(state.publishAt).toLocaleString()}</strong>. It
              will go live at that time.
            </p>
          ) : (
            <p
              style={{
                fontSize: 12.5,
                color: 'var(--ink-3)',
                lineHeight: 1.5,
              }}
            >
              This publishes immediately. To schedule, set a future “Publish at”
              time in the side panel.
            </p>
          )}
        </div>

        <div className="ed-modal-foot">
          <button className="ed-btn ed-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="ed-btn ed-btn-primary" onClick={onConfirm}>
            {isUpdate ? 'Update now' : 'Publish to SIGNL'}
          </button>
        </div>
      </div>
    </div>
  )
}
