'use client'

const tabs = [

  'SUMMARY',

  'ARTICLE',

  'ANALYSIS'
]

export default function
DepthTabs({

  selected,

  onChange

}: any) {

  return (

    <div className="depth-tabs">

      {tabs.map((tab) => (

        <button

          key={tab}

          className={
            selected === tab
              ? 'active'
              : ''
          }

          onClick={() =>
            onChange(tab)
          }
        >

          {tab}

        </button>

      ))}
    </div>
  )
}