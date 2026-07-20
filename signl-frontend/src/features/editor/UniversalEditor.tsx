'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import { updateDraft, publishDraft, type EditorArticle } from '@/services/editor.service'
import { useToast } from '@/components/ui/Toast'

interface Props {
  draft: EditorArticle
}

type SyncState = 'idle' | 'saving' | 'synced' | 'error'

const AUTOSAVE_DELAY_MS = 700

/**
 * Universal publishing editor — Title + Subheading + Body, like the X.com
 * Articles reference. Writers structure the body themselves using the inline
 * toolbar (headings, lists, quotes, links, bold/italic) — no separate fields
 * for sections, analysis steps, depths, summary points, etc.
 *
 * Autosaves every {AUTOSAVE_DELAY_MS} of idle time. Shows a "Synchronised"
 * pill matching the reference. Existing meta (slug, category, premium, cover,
 * tags) is preserved on the article server-side; this UI only edits the
 * three writer-facing fields plus publish action.
 */
export default function UniversalEditor({ draft }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const [headline, setHeadline] = useState(draft.headline ?? '')
  const [subheading, setSubheading] = useState(
    draft.subheading ?? draft.summary ?? '',
  )
  const [sync, setSync] = useState<SyncState>('idle')
  const [publishing, setPublishing] = useState(false)

  // The pending-changes flag lets the autosave effect skip cycles when there
  // is nothing new to send. Reset to false right before each save fires.
  const dirtyRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      TipTapLink.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['http', 'https', 'mailto'],
        HTMLAttributes: {
          rel: 'noopener nofollow',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder: 'Begin composing an article…',
        emptyEditorClass: 'is-empty',
      }),
    ],
    // Restore body — prefer the editor's native JSON when we have it (lossless
    // round-trip); fall back to sanitized HTML (also lossless for our policy).
    content:
      (draft.contentJson as object | null) ??
      draft.contentHtml ??
      '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'universal-editor-body',
        spellcheck: 'true',
      },
    },
    onUpdate: () => {
      dirtyRef.current = true
      scheduleSave()
    },
  })

  // Mark dirty whenever the title/subheading change.
  useEffect(() => {
    dirtyRef.current = true
    scheduleSave()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headline, subheading])

  // Cleanup pending timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const performSave = useCallback(
    async (ed: Editor | null) => {
      if (!ed) return
      dirtyRef.current = false
      setSync('saving')
      try {
        const html = ed.getHTML()
        const json = ed.getJSON()
        await updateDraft(draft.id, {
          headline: headline.trim(),
          subheading: subheading.trim() || null,
          contentHtml: html,
          contentJson: json,
        })
        setSync('synced')
      } catch {
        setSync('error')
      }
    },
    [draft.id, headline, subheading],
  )

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (dirtyRef.current) performSave(editor)
    }, AUTOSAVE_DELAY_MS)
  }, [editor, performSave])

  // Save now (used by the explicit toolbar action and publish flow).
  const flushSave = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (dirtyRef.current || sync === 'idle') {
      await performSave(editor)
    }
  }, [editor, performSave, sync])

  async function handlePublish() {
    if (!editor) return
    setPublishing(true)
    try {
      await flushSave()
      await publishDraft(draft.id)
      toast('Published.', 'success')
      router.push('/editor')
    } catch {
      toast('Could not publish. Try again.', 'error')
    } finally {
      setPublishing(false)
    }
  }

  if (!editor) {
    return (
      <div className="ue-loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-4)' }}>
        Loading editor…
      </div>
    )
  }

  return (
    <div className="universal-editor">
      {/* Top bar — mirrors the reference layout */}
      <div className="ue-topbar">
        <Link href="/editor" className="ue-iconbtn" aria-label="Close editor">
          ✕
        </Link>
        <SyncPill state={sync} />
        <div className="ue-topbar-actions">
          <button
            type="button"
            className="ue-publish-btn"
            onClick={handlePublish}
            disabled={publishing || !headline.trim()}
            title={!headline.trim() ? 'Add a headline before publishing' : 'Publish'}
          >
            {publishing ? 'Publishing…' : 'Publish'}
          </button>
          <Link href="/editor" className="ue-drafts-btn">
            Drafts
          </Link>
        </div>
      </div>

      {/* Formatting toolbar — minimal, like the reference */}
      <BodyToolbar editor={editor} />

      {/* Document */}
      <div className="ue-document">
        <input
          className="ue-title"
          placeholder="Title"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          aria-label="Article title"
          maxLength={300}
        />
        <textarea
          className="ue-subheading"
          placeholder="Add a subheading…"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          aria-label="Article subheading"
          maxLength={500}
          rows={1}
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

/* ── Synchronised pill ─────────────────────────────────────────────────── */
function SyncPill({ state }: { state: SyncState }) {
  const label =
    state === 'saving' ? 'Saving…' :
    state === 'synced' ? 'Synchronised' :
    state === 'error' ? 'Save failed — retrying' :
    'Draft'
  const cls =
    state === 'error' ? 'ue-pill ue-pill-error' :
    state === 'saving' ? 'ue-pill ue-pill-saving' :
    'ue-pill ue-pill-synced'
  return <span className={cls}>{label}</span>
}

/* ── Toolbar ───────────────────────────────────────────────────────────── */
function BodyToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null
  const btn = (
    isActive: boolean,
    onClick: () => void,
    label: string,
    children: React.ReactNode,
  ) => (
    <button
      type="button"
      className={`ue-tb-btn${isActive ? ' is-active' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )

  function addLink() {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link URL', previous ?? 'https://')
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="ue-toolbar" role="toolbar" aria-label="Formatting">
      {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Heading', <strong style={{ fontSize: 15 }}>H</strong>)}
      {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'Subheading', <strong style={{ fontSize: 13 }}>h</strong>)}
      <span className="ue-tb-sep" />
      {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Bold', <strong>B</strong>)}
      {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic', <em>I</em>)}
      {btn(editor.isActive('link'), addLink, 'Link', <span>🔗</span>)}
      <span className="ue-tb-sep" />
      {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), 'Bulleted list', <span>•</span>)}
      {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Numbered list', <span>1.</span>)}
      {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), 'Quote', <span>❝</span>)}
      <span className="ue-tb-sep" />
      {btn(false, () => editor.chain().focus().setHorizontalRule().run(), 'Horizontal rule', <span>—</span>)}
      {btn(false, () => editor.chain().focus().undo().run(), 'Undo', <span>↶</span>)}
      {btn(false, () => editor.chain().focus().redo().run(), 'Redo', <span>↷</span>)}
    </div>
  )
}
