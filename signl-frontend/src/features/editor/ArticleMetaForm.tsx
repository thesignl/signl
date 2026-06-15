'use client'

import { useEffect, useState } from 'react'
import { useEditorStore } from '@/store/editor.store'
import { slugify } from './editor.helpers'
import { Pill } from './EditorBits'
import { listCategories, listAuthors } from '@/services/editor.service'
import type { EditorAuthor, EditorCategory } from '@/types/editor'

const TAG_SUGGESTIONS = [
  'Monetary Policy',
  'Fiscal & Budget',
  'Trade & External',
  'Equities',
  'Debt',
  'FX',
  'Banking',
  'Inflation',
  'Capex',
  'Rupee',
  'RBI',
  'SEBI',
  'FII',
  'IPO',
  'M&A',
]

export default function ArticleMetaForm({
  onSave,
  onPublish,
  onSubmitReview,
}: {
  onSave?: () => void
  onPublish?: () => void
  onSubmitReview?: () => void
}) {
  const state = useEditorStore((s) => s.state)
  const patch = useEditorStore((s) => s.patch)
  const addTag = useEditorStore((s) => s.addTag)
  const removeTag = useEditorStore((s) => s.removeTag)

  const [categories, setCategories] = useState<EditorCategory[]>([])
  const [authors, setAuthors] = useState<EditorAuthor[]>([])
  const [tagDraft, setTagDraft] = useState('')

  useEffect(() => {
    listCategories().then(setCategories).catch(() => {})
    listAuthors().then(setAuthors).catch(() => {})
  }, [])

  if (!state) return null

  const slugPreview = state.slug || slugify(state.headline) || 'your-slug'
  const categorySlug =
    categories.find((c) => c.id === state.categoryId)?.slug ?? 'category'

  return (
    <>
      <div className="ed-side-section">
        <div className="ed-side-label">
          Status <small>{state.status}</small>
        </div>
        <div className="ed-side-row">
          <div style={{ marginBottom: 10 }}>
            <Pill status={state.status} />
          </div>
          <button
            className="ed-btn ed-btn-ghost ed-btn-sm"
            style={{ width: '100%', marginBottom: 6 }}
            onClick={onSave}
          >
            Save draft
          </button>
          <button
            className="ed-btn ed-btn-ink ed-btn-sm"
            style={{ width: '100%', marginBottom: 6 }}
            onClick={onSubmitReview}
          >
            Submit for review
          </button>
          <button
            className="ed-btn ed-btn-primary ed-btn-sm"
            style={{ width: '100%' }}
            onClick={onPublish}
          >
            {state.status === 'PUBLISHED' ? 'Update published version' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">Schedule</div>
        <div className="ed-side-row">
          <div className="ed-side-row-label">Publish at</div>
          <input
            className="ed-side-input"
            type="datetime-local"
            value={state.publishAt ? state.publishAt.slice(0, 16) : ''}
            onChange={(e) =>
              patch({
                publishAt: e.target.value
                  ? new Date(e.target.value).toISOString()
                  : '',
              })
            }
          />
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">Category</div>
        <div className="ed-side-row">
          <select
            className="ed-side-select"
            value={state.categoryId}
            onChange={(e) => patch({ categoryId: e.target.value })}
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">Author</div>
        <div className="ed-side-row">
          <select
            className="ed-side-select"
            value={state.authorId}
            onChange={(e) => patch({ authorId: e.target.value })}
          >
            <option value="">Default byline</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <p
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              color: 'var(--ink-4)',
              marginTop: 5,
              lineHeight: 1.45,
            }}
          >
            Authors are byline entities, separate from the logged-in user.
          </p>
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">URL slug</div>
        <div className="ed-side-row">
          <input
            className="ed-side-input"
            value={state.slug}
            placeholder="auto-generated-from-headline"
            onChange={(e) => patch({ slug: e.target.value })}
          />
          <div className="ed-slug-pretty">
            <span className="ed-slug-domain">signl.in/{categorySlug}/</span>
            <span>{slugPreview}</span>
          </div>
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">Tags</div>
        <div className="ed-side-row">
          <div className="ed-tag-shell">
            {state.tags.map((t) => (
              <span className="ed-tag-pill" key={t}>
                {t}
                <span className="remove" onClick={() => removeTag(t)}>
                  ×
                </span>
              </span>
            ))}
            <input
              className="ed-tag-input"
              placeholder="Add tag…"
              list="ed-tag-suggestions"
              value={tagDraft}
              onChange={(e) => setTagDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag(tagDraft)
                  setTagDraft('')
                }
              }}
            />
            <datalist id="ed-tag-suggestions">
              {TAG_SUGGESTIONS.map((t) => (
                <option value={t} key={t} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">Access</div>
        <div className="ed-toggle-row" onClick={() => patch({ premium: !state.premium })}>
          <div className="ed-toggle-text">
            <span className="ed-toggle-label">Pro-only</span>
            <span className="ed-toggle-desc">Hide article body behind paywall</span>
          </div>
          <span className={`ed-toggle${state.premium ? ' on' : ''}`}>
            <span className="ed-toggle-track">
              <span className="ed-toggle-thumb" />
            </span>
          </span>
        </div>
        <div
          className="ed-toggle-row"
          style={{
            borderTop: '1px dashed var(--admin-border)',
            marginTop: 8,
            paddingTop: 14,
          }}
          onClick={() => patch({ featured: !state.featured })}
        >
          <div className="ed-toggle-text">
            <span className="ed-toggle-label">Featured</span>
            <span className="ed-toggle-desc">Placement boost on the homepage</span>
          </div>
          <span className={`ed-toggle${state.featured ? ' on' : ''}`}>
            <span className="ed-toggle-track">
              <span className="ed-toggle-thumb" />
            </span>
          </span>
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">Media</div>
        <div className="ed-side-row">
          <div className="ed-side-row-label">Cover image URL</div>
          <input
            className="ed-side-input"
            value={state.coverImage}
            placeholder="https://…"
            onChange={(e) => patch({ coverImage: e.target.value })}
          />
        </div>
      </div>

      <div className="ed-side-section">
        <div className="ed-side-label">
          SEO <small>Optional</small>
        </div>
        <div className="ed-side-row">
          <div className="ed-side-row-label">SEO title</div>
          <input
            className="ed-side-input"
            value={state.seoTitle}
            placeholder="Defaults to headline"
            onChange={(e) => patch({ seoTitle: e.target.value })}
          />
        </div>
        <div className="ed-side-row">
          <div className="ed-side-row-label">Meta description</div>
          <textarea
            className="ed-side-textarea"
            rows={3}
            value={state.seoDescription}
            placeholder="Defaults to synopsis (155 chars max)"
            onChange={(e) => patch({ seoDescription: e.target.value })}
          />
        </div>
        <div className="ed-side-row">
          <div className="ed-side-row-label">Read time override</div>
          <input
            className="ed-side-input"
            type="number"
            value={state.readTime || ''}
            placeholder="Auto-calculated"
            onChange={(e) =>
              patch({ readTime: parseInt(e.target.value) || 0 })
            }
          />
        </div>
      </div>
    </>
  )
}
