'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import EditorHeader from '@/features/editor/EditorHeader'
import EditorSidebar from '@/features/editor/EditorSidebar'
import DepthTabs from '@/features/editor/DepthTabs'
import BlockEditor from '@/features/editor/BlockEditor'
import FrameworkEditor from '@/features/editor/FrameworkEditor'
import PublishBar from '@/features/editor/PublishBar'

import { getDraft } from '@/services/editor.service'
import { useEditorStore } from '@/store/editor.store'

import type {
ContentBlock,
AnalysisStep,
} from '@/types/editor'

export default function EditorPage() {
const params = useParams()

const articleId = params.id as string

const {
article,
setArticle,
} = useEditorStore()

const [loading, setLoading] =
useState(true)

const [selectedDepth, setSelectedDepth] =
useState('ARTICLE')

const [blocks, setBlocks] =
useState<ContentBlock[]>([])

const [steps, setSteps] =
useState<AnalysisStep[]>([])

useEffect(() => {
    const loadDraft = async () => {
        try {
        const draft =
            await getDraft(articleId)

        setArticle(draft)

        setBlocks(
            draft.blocks ?? []
        )

        setSteps(
            draft.analysisSteps ?? []
        )
        } catch (error) {
        console.error(
            'Failed to load draft',
            error
        )
        } finally {
        setLoading(false)
        }
    }

    if (articleId) {
        loadDraft()
    }
    }, [
    articleId,
    setArticle,
    ])

    if (loading) {
    return ( <div className="flex items-center justify-center min-h-screen">
    Loading editor... </div>
    )
}

if (!article) {
return ( <div className="flex items-center justify-center min-h-screen">
Draft not found </div>
)
}

return ( 

<div className="editor-page"> <EditorHeader
     article={article}
   />

```
  <div className="editor-layout">

    <aside className="editor-left">
      <EditorSidebar
        article={article}
      />
    </aside>

    <main className="editor-main">
      <DepthTabs
        selected={selectedDepth}
        onChange={setSelectedDepth}
      />

      <div className="editor-content">

        <input
          className="editor-title"
          value={article.title}
          placeholder="Article title..."
          readOnly
        />

        <BlockEditor
          blocks={blocks}
          setBlocks={setBlocks}
        />

        <FrameworkEditor
          steps={steps}
          setSteps={setSteps}
        />

      </div>
    </main>

    <aside className="editor-right">

      <PublishBar
        articleId={article.id}
      />

      <div className="editor-card">
        <h3>Publication</h3>

        <div>
          Status: {article.status}
        </div>

        <div>
          Type: {article.articleType}
        </div>

        <div>
          Read Time: {article.readTime} min
        </div>

        <div>
          Views: {article.views}
        </div>
      </div>

      <div className="editor-card">
        <h3>Stats</h3>

        <div>
          Blocks: {blocks.length}
        </div>

        <div>
          Framework Steps: {steps.length}
        </div>

        <div>
          Premium: {article.premium ? 'Yes' : 'No'}
        </div>

        <div>
          Verified: {article.verified ? 'Yes' : 'No'}
        </div>
      </div>

    </aside>
  </div>
</div>

)
}
