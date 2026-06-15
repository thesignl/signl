'use client'

import { useState } from 'react'
import { useEditorStore } from '@/store/editor.store'
import type { EditorBlock } from '@/types/editor'
import AutoTextarea from './AutoTextarea'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CopyIcon,
  TrashIcon,
  GripIcon,
  PlusIcon,
} from './icons'

type BlockKey = 'blocks' | 'analysisBlocks'

const PLACEHOLDERS: Record<EditorBlock['type'], string> = {
  paragraph: 'Type to write…',
  heading: 'Section heading',
  quote: 'Pull a quote that anchors the section',
  datatable: '',
}

const ADD_ITEMS: {
  type: EditorBlock['type']
  icon: string
  label: string
  desc: string
}[] = [
  { type: 'paragraph', icon: '¶', label: 'Paragraph', desc: 'Plain prose' },
  { type: 'heading', icon: 'H', label: 'Heading', desc: 'Section break' },
  { type: 'quote', icon: '"', label: 'Pull quote', desc: 'Emphasized callout' },
  {
    type: 'datatable',
    icon: '▦',
    label: 'Data table',
    desc: 'Comparative numbers',
  },
]

export default function BlockEditor({ blockKey }: { blockKey: BlockKey }) {
  const blocks = useEditorStore((s) => s.state?.[blockKey] ?? [])
  const updateBlock = useEditorStore((s) => s.updateBlock)
  const moveBlock = useEditorStore((s) => s.moveBlock)
  const duplicateBlock = useEditorStore((s) => s.duplicateBlock)
  const deleteBlock = useEditorStore((s) => s.deleteBlock)
  const addBlock = useEditorStore((s) => s.addBlock)
  const [openMenu, setOpenMenu] = useState<number | null>(null)

  return (
    <div className="ed-blocks-area">
      {blocks.map((block, i) => (
        <Block
          key={block.id}
          block={block}
          onChange={(patch) => updateBlock(blockKey, i, patch)}
          onMoveUp={() => moveBlock(blockKey, i, -1)}
          onMoveDown={() => moveBlock(blockKey, i, 1)}
          onDuplicate={() => duplicateBlock(blockKey, i)}
          onDelete={() => deleteBlock(blockKey, i)}
        />
      ))}

      <AddBlockRow
        open={openMenu === blocks.length}
        onToggle={() =>
          setOpenMenu(openMenu === blocks.length ? null : blocks.length)
        }
        onPick={(type) => {
          addBlock(blockKey, blocks.length, type)
          setOpenMenu(null)
        }}
      />
    </div>
  )
}

function Block({
  block,
  onChange,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
}: {
  block: EditorBlock
  onChange: (patch: Partial<EditorBlock>) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  return (
    <div className={`ed-block ${block.type}`}>
      <span className="ed-block-handle" title="Drag to reorder">
        <GripIcon width={13} height={13} />
      </span>

      {block.type === 'datatable' ? (
        <DataTable block={block} onChange={onChange} />
      ) : block.type === 'quote' ? (
        <>
          <AutoTextarea
            className="ed-block-content"
            placeholder={PLACEHOLDERS.quote}
            rows={2}
            value={block.content}
            onChange={(e) => onChange({ content: e.target.value })}
          />
          <div className="ed-quote-cite">
            <input
              className="ed-cite-input"
              placeholder="— Attribution (optional)"
              value={block.cite ?? ''}
              onChange={(e) => onChange({ cite: e.target.value })}
            />
          </div>
        </>
      ) : (
        <AutoTextarea
          className="ed-block-content"
          placeholder={PLACEHOLDERS[block.type]}
          rows={1}
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
        />
      )}

      <div className="ed-block-toolbar">
        <span className="ed-block-type-label">
          {block.type === 'datatable' ? 'Data table' : block.type}
        </span>
        <div className="ed-block-actions">
          <button className="ed-block-action" title="Move up" onClick={onMoveUp}>
            <ChevronUpIcon width={11} height={11} />
          </button>
          <button
            className="ed-block-action"
            title="Move down"
            onClick={onMoveDown}
          >
            <ChevronDownIcon width={11} height={11} />
          </button>
          <button
            className="ed-block-action"
            title="Duplicate"
            onClick={onDuplicate}
          >
            <CopyIcon width={11} height={11} />
          </button>
          <button
            className="ed-block-action danger"
            title="Delete"
            onClick={onDelete}
          >
            <TrashIcon width={11} height={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

function DataTable({
  block,
  onChange,
}: {
  block: EditorBlock
  onChange: (patch: Partial<EditorBlock>) => void
}) {
  const data = block.data ?? [
    ['', '', ''],
    ['', '', ''],
  ]
  const cols = data[0]?.length ?? 3

  const setCell = (r: number, c: number, value: string) => {
    const next = data.map((row) => [...row])
    next[r][c] = value
    onChange({ data: next })
  }

  return (
    <div style={{ padding: 12 }}>
      <div className="ed-dt-toolbar">Data table</div>
      <div
        className="ed-dt-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {data.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              className={`ed-dt-cell ${r === 0 ? 'header' : ''}`}
              value={cell}
              onChange={(e) => setCell(r, c, e.target.value)}
            />
          )),
        )}
      </div>
    </div>
  )
}

function AddBlockRow({
  open,
  onToggle,
  onPick,
}: {
  open: boolean
  onToggle: () => void
  onPick: (type: EditorBlock['type']) => void
}) {
  return (
    <div className="ed-add-block-row">
      <button className="ed-add-block-trigger" onClick={onToggle}>
        <PlusIcon width={11} height={11} />
        Add block
      </button>
      {open ? (
        <div className="ed-add-block-menu">
          {ADD_ITEMS.map((item) => (
            <button
              key={item.type}
              className="ed-add-block-item"
              onClick={() => onPick(item.type)}
            >
              <span className="ed-add-block-item-icon">{item.icon}</span>
              <span>
                <span>{item.label}</span>
                <div className="ed-add-block-item-desc">{item.desc}</div>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
