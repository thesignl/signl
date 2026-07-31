'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import { useToast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'
import {
  updateNewsletter,
  previewNewsletter,
  estimateAudience,
  sendNewsletterNow,
  scheduleNewsletter,
  listNewsletterCategories,
} from '@/services/newsletter-admin.service'
import type { NewsletterCategory, NewsletterDetail } from '@/types/newsletter'

interface Props {
  newsletter: NewsletterDetail
  /** Where to return after a successful send/schedule. */
  listHref?: string
}

type SyncState = 'idle' | 'saving' | 'synced' | 'error'
const AUTOSAVE_DELAY_MS = 800

export default function NewsletterComposer({ newsletter, listHref = '/admin/campaigns' }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState(newsletter.title ?? '')
  const [subject, setSubject] = useState(newsletter.subject ?? '')
  const [preheader, setPreheader] = useState(newsletter.preheader ?? '')
  const [categoryId, setCategoryId] = useState(newsletter.categoryId ?? '')
  const [categories, setCategories] = useState<NewsletterCategory[]>([])
  const [sync, setSync] = useState<SyncState>('idle')

  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [audience, setAudience] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')

  const dirtyRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
      TipTapLink.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['http', 'https', 'mailto'],
        HTMLAttributes: { rel: 'noopener nofollow', target: '_blank' },
      }),
      Placeholder.configure({
        placeholder: 'Write the newsletter body…',
        emptyEditorClass: 'is-empty',
      }),
    ],
    content: (newsletter.contentJson as object | null) ?? newsletter.contentHtml ?? '',
    immediatelyRender: false,
    editorProps: { attributes: { class: 'universal-editor-body', spellcheck: 'true' } },
    onUpdate: () => {
      dirtyRef.current = true
      scheduleSave()
    },
  })

  useEffect(() => {
    listNewsletterCategories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  const save = useCallback(async () => {
    if (!editor) return
    setSync('saving')
    try {
      await updateNewsletter(newsletter.id, {
        title,
        subject,
        preheader: preheader || null,
        categoryId: categoryId || null,
        contentHtml: editor.getHTML(),
        contentJson: editor.getJSON(),
      })
      dirtyRef.current = false
      setSync('synced')
    } catch {
      setSync('error')
    }
  }, [editor, newsletter.id, title, subject, preheader, categoryId])

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (dirtyRef.current) void save()
    }, AUTOSAVE_DELAY_MS)
  }, [save])

  // Autosave when meta fields change.
  useEffect(() => {
    dirtyRef.current = true
    scheduleSave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subject, preheader, categoryId])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  async function openPreview() {
    await save()
    try {
      const [p, a] = await Promise.all([
        previewNewsletter(newsletter.id),
        estimateAudience(newsletter.id),
      ])
      setPreviewHtml(p.html)
      setAudience(a.count)
    } catch {
      toast('Could not build preview.', 'error')
    }
  }

  async function handleSendNow() {
    if (!subject.trim() || !editor?.getText().trim()) {
      toast('Add a subject and body before sending.', 'error')
      return
    }
    if (!confirm(`Send "${subject}" to ${audience ?? 'all'} subscribers now?`)) return
    setBusy(true)
    try {
      await save()
      await sendNewsletterNow(newsletter.id)
      toast('Campaign is sending.', 'success')
      router.push(listHref)
    } catch (e) {
      toast(errMsg(e, 'Send failed.'), 'error')
    } finally {
      setBusy(false)
    }
  }

  async function handleSchedule() {
    if (!scheduleAt) {
      toast('Pick a date and time.', 'error')
      return
    }
    setBusy(true)
    try {
      await save()
      await scheduleNewsletter(newsletter.id, new Date(scheduleAt).toISOString())
      toast('Campaign scheduled.', 'success')
      router.push(listHref)
    } catch (e) {
      toast(errMsg(e, 'Schedule failed.'), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="nl-composer">
      <div className="nl-composer-head">
        <input
          className="nl-composer-title"
          placeholder="Newsletter title (internal)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Newsletter title"
        />
        <span className={`nl-sync nl-sync-${sync}`}>
          {sync === 'saving' ? 'Saving…' : sync === 'synced' ? 'Saved' : sync === 'error' ? 'Save failed' : ''}
        </span>
      </div>

      <div className="nl-composer-grid">
        <div className="nl-composer-main">
          <input
            className="nl-field"
            placeholder="Email subject line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-label="Email subject"
          />
          <input
            className="nl-field nl-field-sub"
            placeholder="Preheader (preview text shown in inbox)"
            value={preheader}
            onChange={(e) => setPreheader(e.target.value)}
            aria-label="Preheader"
          />
          <div className="nl-editor-wrap">
            <EditorContent editor={editor} />
          </div>
        </div>

        <aside className="nl-composer-side">
          <div className="nl-side-block">
            <label className="nl-side-label" htmlFor="nl-cat">Type</label>
            <select
              id="nl-cat"
              className="nl-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">All subscribers (no type)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="nl-side-block nl-actions">
            <Button variant="secondary" size="md" onClick={openPreview}>
              Preview email
            </Button>
            <Button variant="accent" size="md" loading={busy} onClick={handleSendNow}>
              Send now
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowSchedule((v) => !v)}
            >
              Schedule…
            </Button>
            {showSchedule && (
              <div className="nl-schedule">
                <input
                  type="datetime-local"
                  className="nl-field"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  aria-label="Schedule date and time"
                />
                <Button variant="primary" size="sm" loading={busy} onClick={handleSchedule}>
                  Confirm schedule
                </Button>
              </div>
            )}
            {audience != null && (
              <p className="nl-audience-note">Audience: {audience.toLocaleString()} subscribers</p>
            )}
          </div>
        </aside>
      </div>

      {previewHtml != null && (
        <div className="nl-preview-overlay" role="dialog" aria-label="Email preview" onClick={() => setPreviewHtml(null)}>
          <div className="nl-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nl-preview-bar">
              <span>Email preview</span>
              <button className="nl-preview-close" onClick={() => setPreviewHtml(null)} aria-label="Close preview">✕</button>
            </div>
            <iframe className="nl-preview-frame" title="Email preview" srcDoc={previewHtml} />
          </div>
        </div>
      )}
    </div>
  )
}

function errMsg(e: unknown, fallback: string): string {
  return (
    (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}
