'use client'

const tabs = [

  'All',

  'Macro',

  'Markets',

  'Policy',

  'Infrastructure',

  'AI',

  'Geopolitics'
]

export default function
FrameworkTabs() {

  return (

    <div className="framework-tabs">

      {tabs.map((tab, index) => (

        <button

          key={tab}

          className={

            `fw-tab ${
              index === 0
                ? 'active'
                : ''
            }`
          }
        >

          {tab}

        </button>
      ))}
    </div>
  )
}