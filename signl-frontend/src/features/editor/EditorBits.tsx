'use client'

import type { Depth, ListStatus, SaveStatus } from '@/types/editor'

const PILL_LABEL: Record<ListStatus, string> = {
  DRAFT: 'Draft',
  REVIEW: 'In Review',
  SCHEDULED: 'Scheduled',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

const PILL_CLASS: Record<ListStatus, string> = {
  DRAFT: 'ed-pill-draft',
  REVIEW: 'ed-pill-review',
  SCHEDULED: 'ed-pill-scheduled',
  PUBLISHED: 'ed-pill-published',
  ARCHIVED: 'ed-pill-archived',
}

export function Pill({ status }: { status: ListStatus }) {
  return (
    <span className={`ed-pill ${PILL_CLASS[status]}`}>{PILL_LABEL[status]}</span>
  )
}

const DEPTH_DEFS: [Depth, string][] = [
  ['summary', 'S'],
  ['article', 'A'],
  ['analysis', 'D'],
]

export function DepthChips({ depths }: { depths: Depth[] }) {
  return (
    <div className="ed-depth-chips" title={depths.join(', ')}>
      {DEPTH_DEFS.map(([key, letter]) => (
        <span
          key={key}
          className={`ed-depth-chip ${depths.includes(key) ? key : 'off'}`}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}

export function AutosaveIndicator({
  status,
  lastSavedLabel,
}: {
  status: SaveStatus
  lastSavedLabel: string
}) {
  const cls =
    status === 'saving' ? 'saving' : status === 'error' ? 'error' : ''
  const text =
    status === 'saving'
      ? 'Saving…'
      : status === 'error'
        ? 'Save failed — retrying'
        : `Saved ${lastSavedLabel}`
  return (
    <div className={`ed-autosave ${cls}`}>
      <span className="dot" />
      <span>{text}</span>
    </div>
  )
}
