export default function
SignalCard({

  title,

  text

}: {

  title: string

  text: string
}) {

  return (

    <div className="signal-card">

      <div
        className="
          signal-card-label
        "
      >

        LIVE SIGNAL
      </div>

      <div
        className="
          signal-card-title
        "
      >

        {title}
      </div>

      <div
        className="
          signal-card-text
        "
      >

        {text}
      </div>

    </div>
  )
}