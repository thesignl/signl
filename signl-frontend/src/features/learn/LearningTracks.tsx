const tracks = [

  'Macroeconomics',

  'AI Systems',

  'Startup Finance',

  'Market Structure',

  'Geopolitics'
]

export default function
LearningTracks() {

  return (

    <div className="learning-tracks">

      {tracks.map((track) => (

        <button
          key={track}
          className="track-pill"
        >

          {track}

        </button>

      ))}

    </div>
  )
}