'use client'

import { useState } from 'react'

import {
  createDraft,
  updateDraft,
  publishDraft
} from '@/services/editor.service'

import EditorLayout from '@/features/editor/EditorLayout'

import ArticleMetaForm from '@/features/editor/ArticleMetaForm'

import DepthTabs from '@/features/editor/DepthTabs'

import BlockEditor from '@/features/editor/BlockEditor'

import SignalEditor from '@/features/editor/SignalEditor'

import FrameworkEditor from '@/features/editor/FrameworkEditor'

import TagInput from '@/features/editor/TagInput'

import PublishBar from '@/features/editor/PublishBar'

import useAutosave from '@/hooks/useAutosave'
import router from 'next/dist/shared/lib/router/router'
import Router from 'next/router'

export default async function EditorPage() {

  const [articleId,
    setArticleId] =
    useState<string>()

  const [activeDepth,
    setActiveDepth] =
    useState('ARTICLE')

  const [form,
    setForm] =
    useState({

      title: '',
      summary: '',
      signal: ''
    })

  const [blocks,setBlocks] = useState<any[]>([])

  const [tags,
    setTags] =
    useState<string[]>([])

  const [steps,
    setSteps] =
    useState([
      {
        title: '',
        description: ''
      },
      {
        title: '',
        description: ''
      },
      {
        title: '',
        description: ''
      },
      {
        title: '',
        description: ''
      },
      {
        title: '',
        description: ''
      }
    ])

  const saveDraft =
  async () => {

    if (!articleId) {

      const draft =
        await createDraft(
          form
        )

      setArticleId(
        draft.id
      )

      return
    }

    await updateDraft(
      articleId,
      {
        ...form,
        blocks,
        steps,
        tags
      }
    )
  }

  const publish =
  async () => {

    if (!articleId)
      return

    await publishDraft(
      articleId
    )
  }

  useAutosave(
    saveDraft,
    [
      form,
      blocks,
      tags,
      steps
    ]
  )

  return (

    <EditorLayout

      left={

        <ArticleMetaForm

          form={form}

          setForm={setForm}
        />
      }

      center={

        <>
          <DepthTabs

            active={
              activeDepth
            }

            setActive={
              setActiveDepth
            }
          />

          <BlockEditor blocks={blocks} setBlocks={setBlocks} />
        </>
      }

      right={

        <>
          <SignalEditor

            signal={
              form.signal
            }

            setSignal={(
              value: string
            ) =>
              setForm({

                ...form,

                signal:
                  value
              })
            }
          />

          <FrameworkEditor

            steps={steps}

            setSteps={
              setSteps
            }
          />

          <TagInput

            tags={tags}

            setTags={
              setTags
            }
          />

          <PublishBar

            onSave={
              saveDraft
            }

            onPublish={
              publish
            }
          />
        </>
      }
    />
  )
}