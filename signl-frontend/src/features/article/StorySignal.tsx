export default function StorySignal({ signal }: { signal: string }) {
  return (
    <>
      <hr className="story-signal-rule" />
      <div className="story-signal" role="note" aria-label="The signal">
        <strong>The signal</strong>
        {signal}
      </div>
    </>
  )
}
