'use client'

export default function
ArticleMetaForm({

  form,

  setForm

}: any) {

  return (

    <div className="editor-meta">

      <input

        placeholder="Title"

        value={form.title}

        onChange={(e) =>
          setForm({

            ...form,

            title:
              e.target.value
          })
        }
      />

      <textarea

        placeholder="Summary"

        value={form.summary}

        onChange={(e) =>
          setForm({

            ...form,

            summary:
              e.target.value
          })
        }
      />

    </div>
  )
}