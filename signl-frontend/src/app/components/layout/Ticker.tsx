export default function Ticker() {

  return (

    <div className="ticker">

      <div className="ticker-label">
        Markets
      </div>

      <div
        style={{
          overflow: 'hidden',
          flex: 1,
          display: 'flex'
        }}
      >

        <div className="ticker-track">

          <div className="ticker-item">
            SENSEX
            <span className="up">
              ▲ 74,382 (+0.43%)
            </span>
          </div>

          <div className="ticker-item">
            NIFTY 50
            <span className="up">
              ▲ 22,611 (+0.38%)
            </span>
          </div>

        </div>

      </div>

    </div>
  )
}