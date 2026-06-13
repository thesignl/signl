'use client'

export default function
TagInput({

  tags,
  setTags

}: any) {

  const addTag = (
    value: string
  ) => {

    if (!value.trim())
      return

    setTags([
      ...tags,
      value
    ])
  }

  return (

    <div>

      <input

        placeholder="Add tag"

        onKeyDown={(e) => {

          if (
            e.key === 'Enter'
          ) {

            addTag(
              e.currentTarget.value
            )

            e.currentTarget.value = ''
          }
        }}
      />

      <div>

        {tags.map(
          (
            tag: string
          ) => (

            <span
              key={tag}
            >
              {tag}
            </span>
          )
        )}

      </div>

    </div>
  )
}