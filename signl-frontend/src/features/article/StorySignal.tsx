export default function
StorySignal({

  signal

}: {
  signal: string
}) {

  return (

    <>

      <hr
        className="story-signal-rule"
      />

      <div className="story-signal">

        <strong>
          THE SIGNAL
        </strong>

        {signal}

      </div>

    </>
  )
}