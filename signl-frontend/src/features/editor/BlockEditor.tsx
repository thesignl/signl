'use client'

export default function
BlockEditor({

  blocks,

  setBlocks

}: any) {

  const addParagraph =
  () => {

    setBlocks([

      ...blocks,

      {

        id: crypto.randomUUID(),

        type: 'PARAGRAPH',

        content: {

          text: ''
        }
      }
    ])
  }

  return (

    <div>

      <button
        onClick={addParagraph}
      >

        + Paragraph
      </button>

      {blocks.map(
        (
          block: any,
          index: number
        ) => (

          <textarea

            key={block.id}

            value={
              block.content.text
            }

            onChange={(e) => {

              const copy =
                [...blocks]

              copy[index]
                .content
                .text =
                e.target.value

              setBlocks(copy)
            }}
          />
        )
      )}

    </div>
  )
}