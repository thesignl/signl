'use client'

import { useEditorStore } from '@/store/editor.store'
import { isDepthEmpty } from './editor.helpers'
import type { Depth } from '@/types/editor'

const DEPTH_META: { key: Depth; label: string; tag: string }[] = [
  { key: 'summary', label: 'Summary', tag: 'Free · Required' },
  { key: 'article', label: 'Article', tag: 'Free' },
  { key: 'analysis', label: 'Analysis', tag: 'Pro' },
]

/** Depth selector (which surfaces exist) + depth tabs (which one is editing). */
export default function DepthTabs({
  onInfo,
}: {
  onInfo?: (msg: string) => void
}) {
  const state = useEditorStore((s) => s.state)
  const toggleDepth = useEditorStore((s) => s.toggleDepth)
  const setActiveDepth = useEditorStore((s) => s.setActiveDepth)

  if (!state) return null
  const { depths, activeDepth } = state

  return (
    <>
      <div className="ed-depth-bar">
        <div className="ed-depth-bar-label">Article depths</div>
        <div className="ed-depth-options">
          {DEPTH_META.map(({ key, label, tag }) => {
            const on = depths.includes(key)
            return (
              <div
                key={key}
                className={`ed-depth-opt ${key}${on ? ' on' : ''}`}
                onClick={() => {
                  if (key === 'summary') {
                    onInfo?.(
                      'Summary is always included — every article has one',
                    )
                    return
                  }
                  toggleDepth(key)
                }}
              >
                <span className="ed-depth-opt-check" />
                <span>{label}</span>
                <small>{tag}</small>
              </div>
            )
          })}
        </div>
      </div>

      <div className="ed-depth-tabs">
        {DEPTH_META.map(({ key, label }) => {
          const on = depths.includes(key)
          const active = activeDepth === key
          const empty = on && isDepthEmpty(state, key)
          return (
            <button
              key={key}
              className={`ed-depth-tab ${key}${active ? ' active' : ''}${
                !on ? ' disabled' : ''
              }`}
              onClick={() =>
                on
                  ? setActiveDepth(key)
                  : onInfo?.(`Enable ${label} depth above to write it`)
              }
            >
              <span className="tab-dot" />
              {label}
              {empty ? <span className="ed-badge-empty">Empty</span> : null}
            </button>
          )
        })}
      </div>
    </>
  )
}
