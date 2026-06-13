'use client'

export default function
SignalEditor({

  signal,

  setSignal

}: any) {

  return (

    <textarea

      className="signal-box"

      placeholder="What is the signal?"

      value={signal}

      onChange={(e) =>
        setSignal(
          e.target.value
        )
      }
    />
  )
}