import Link from 'next/link'

export default function
DraftCard({

  draft

}: any) {

  return (

    <Link

      href={
        `/editor/${draft.id}`
      }

      className="draft-card"
    >

      <div className="draft-type">

        {draft.articleType}

      </div>

      <h3>

        {draft.title}

      </h3>

      <p>

        {draft.summary}
      </p>

      <div>

        Updated:

        {' '}

        {new Date(
          draft.updatedAt
        ).toLocaleDateString()}
      </div>

    </Link>
  )
}