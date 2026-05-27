export default function StoryContent({

  content

}: {

  content: any[]
}) {

  return (

    <div className="story-body">

      {content.map((block, i) => {

        if (
          block.type ===
          'paragraph'
        ) {

          return (
            <p key={i}>

              {block.value}

            </p>
          )
        }

        if (
          block.type ===
          'heading'
        ) {

          return (
            <h3 key={i}>

              {block.value}

            </h3>
          )
        }

        if (
          block.type ===
          'quote'
        ) {

          return (
            <blockquote key={i}>

              {block.value}

            </blockquote>
          )
        }

        return null
      })}

    </div>
  )
}