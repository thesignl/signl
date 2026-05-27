const tickerData = [

  {
    label: 'SENSEX',
    value: '74,382',
    change: '+0.43%',
    up: true
  },

  {
    label: 'NIFTY 50',
    value: '22,611',
    change: '+0.38%',
    up: true
  },

  {
    label: 'USD/INR',
    value: '83.54',
    change: '-0.12%',
    up: false
  },

  {
    label: 'NASDAQ',
    value: '17,890',
    change: '+0.67%',
    up: true
  },

  {
    label: 'BRENT',
    value: '$82.14',
    change: '-0.31%',
    up: false
  },

  {
    label: 'GOLD',
    value: '$2,341',
    change: '+0.22%',
    up: true
  },

  {
    label: '10Y GSEC',
    value: '7.08%',
    change: '-2bps',
    up: false
  },

  {
    label: 'BTC',
    value: '$68,240',
    change: '+1.14%',
    up: true
  }
]

export default function Ticker() {

  return (

    <div className="ticker">

      <div className="ticker-label">

        Markets

      </div>

      <div className="ticker-wrapper">

        <div className="ticker-track">

          {[

            ...tickerData,
            ...tickerData

          ].map(

            (
              item,
              index
            ) => (

              <div
                key={index}
                className="ticker-item"
              >

                <span>

                  {item.label}

                </span>

                <span
                  className={
                    item.up
                      ? 'up'
                      : 'dn'
                  }
                >

                  {

                    item.up
                      ? '▲'
                      : '▼'

                  }

                  {' '}

                  {item.value}

                  {' '}

                  (

                  {item.change}

                  )

                </span>

              </div>
            )
          )}

        </div>

      </div>

    </div>
  )
}