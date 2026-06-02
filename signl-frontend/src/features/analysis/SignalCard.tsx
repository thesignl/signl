export default function SignalCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <article className="signal-card">
      <div className="signal-card-label">Live signal</div>
      <h3 className="signal-card-title">{title}</h3>
      <p className="signal-card-text">{text}</p>
    </article>
  )
}
