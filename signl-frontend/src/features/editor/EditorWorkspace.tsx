'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import EditorLayout from './EditorLayout'
import HeadlineArea from './HeadlineArea'
import DepthTabs from './DepthTabs'
import SummaryEditor from './SummaryEditor'
import BlockEditor from './BlockEditor'
import AnalysisEditor from './AnalysisEditor'
import ArticleMetaForm from './ArticleMetaForm'
import StatsStrip from './StatsStrip'
import PreviewModal from './PreviewModal'
import PublishModal from './PublishModal'
import { AutosaveIndicator } from './EditorBits'
import { EyeIcon } from './icons'

import { useEditorStore } from '@/store/editor.store'
import { useEditorAutosave } from '@/hooks/useEditorAutosave'
import { useToast } from '@/components/ui/Toast'
import { publishDraft, submitForReview } from '@/services/editor.service'
import { listCategories, listAuthors } from '@/services/editor.service'

function relativeLabel(iso: string | null): string {
  if (!iso) return 'never'
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 8000) return 'just now'
  if (diff < 60000) return `${Math.round(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.round(diff / 60000)}m ago`
  return new Date(iso).toLocaleDateString()
}

export default function EditorWorkspace() {
  const router = useRouter()
  const { toast } = useToast()
  const state = useEditorStore((s) => s.state)
  const saveStatus = useEditorStore((s) => s.saveStatus)
  const lastSavedAt = useEditorStore((s) => s.lastSavedAt)
  const { saveNow } = useEditorAutosave()

  const [preview, setPreview] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [meta, setMeta] = useState<{ category: string; author: string }>({
    category: '',
    author: '',
  })

  // resolve display names for the preview header
  useEffect(() => {
    if (!state) return
    Promise.all([listCategories(), listAuthors()])
      .then(([cats, authors]) => {
        setMeta({
          category: cats.find((c) => c.id === state.categoryId)?.name ?? '',
          author: authors.find((a) => a.id === state.authorId)?.name ?? 'Signl Desk',
        })
      })
      .catch(() => {})
  }, [state?.categoryId, state?.authorId, state])

  const lastSavedLabel = useMemo(
    () => relativeLabel(lastSavedAt),
    [lastSavedAt],
  )

  const doSave = useCallback(async () => {
    await saveNow()
    toast('Draft saved', 'success')
  }, [saveNow, toast])

  const doPublish = useCallback(async () => {
    const cur = useEditorStore.getState().state
    if (!cur) return
    try {
      await saveNow()
      const id = useEditorStore.getState().state?.id
      if (!id) return
      const updated = await publishDraft(id)
      useEditorStore.getState().hydrate(updated)
      setPublishing(false)
      toast('Published to SIGNL', 'success')
      router.push('/editor?status=published')
    } catch {
      toast('Publish failed. Please try again.', 'error')
    }
  }, [saveNow, toast, router])

  const doSubmitReview = useCallback(async () => {
    const cur = useEditorStore.getState().state
    if (!cur) return
    try {
      await saveNow()
      const id = useEditorStore.getState().state?.id
      if (!id) return
      const updated = await submitForReview(id)
      useEditorStore.getState().hydrate(updated)
      toast('Submitted for review', 'info')
      router.push('/editor?status=review')
    } catch {
      toast('Could not submit for review.', 'error')
    }
  }, [saveNow, toast, router])

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreview(false)
        setPublishing(false)
        return
      }
      if (!(e.metaKey || e.ctrlKey)) return
      const s = useEditorStore.getState()
      if (e.key === 's') {
        e.preventDefault()
        void doSave()
      } else if (e.key === 'p') {
        e.preventDefault()
        setPreview(true)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        setPublishing(true)
      } else if (e.key === '1' && s.state?.depths.includes('summary')) {
        e.preventDefault()
        s.setActiveDepth('summary')
      } else if (e.key === '2' && s.state?.depths.includes('article')) {
        e.preventDefault()
        s.setActiveDepth('article')
      } else if (e.key === '3' && s.state?.depths.includes('analysis')) {
        e.preventDefault()
        s.setActiveDepth('analysis')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [doSave])

  if (!state) return null

  const activeDepth = state.activeDepth

  return (
    <EditorLayout
      activeNav="editor"
      crumbs={[
        { label: 'Editor' },
        { label: 'My Articles', href: '/editor' },
        { label: state.isNew ? 'New article' : 'Editing' },
      ]}
      topbarExtra={
        <AutosaveIndicator status={saveStatus} lastSavedLabel={lastSavedLabel} />
      }
      actions={
        <>
          <button
            className="ed-btn ed-btn-ghost ed-btn-sm"
            onClick={() => setPreview(true)}
          >
            <EyeIcon width={12} height={12} />
            Preview
          </button>
          <button
            className="ed-btn ed-btn-ghost ed-btn-sm"
            onClick={doSave}
          >
            Save draft
          </button>
          <button
            className="ed-btn ed-btn-primary ed-btn-sm"
            onClick={() => setPublishing(true)}
          >
            {state.status === 'PUBLISHED' ? 'Update' : 'Publish'}
          </button>
        </>
      }
    >
      <div className="ed-editor-shell">
        <div className="ed-editor-main">
          <DepthTabs onInfo={(m) => toast(m, 'info')} />
          <HeadlineArea />

          {activeDepth === 'summary' ? (
            <div className="ed-compose active">
              <SummaryEditor />
            </div>
          ) : null}
          {activeDepth === 'article' ? (
            <div className="ed-compose active">
              <BlockEditor blockKey="blocks" />
            </div>
          ) : null}
          {activeDepth === 'analysis' ? (
            <div className="ed-compose active">
              <AnalysisEditor />
            </div>
          ) : null}
        </div>

        <aside className="ed-editor-side">
          <ArticleMetaForm
            onSave={doSave}
            onPublish={() => setPublishing(true)}
            onSubmitReview={doSubmitReview}
          />
        </aside>
      </div>

      <StatsStrip lastSavedLabel={lastSavedLabel} />

      {preview ? (
        <PreviewModal
          categoryName={meta.category}
          authorName={meta.author}
          onClose={() => setPreview(false)}
        />
      ) : null}
      {publishing ? (
        <PublishModal
          onClose={() => setPublishing(false)}
          onConfirm={doPublish}
        />
      ) : null}
    </EditorLayout>
  )
}
