'use client'

export default function
FrameworkEditor({

  steps,

  setSteps

}: any) {

  return (

    <div>

      {steps.map(
        (
          step: any,
          index: number
        ) => (

          <div key={index}>

            <input

              value={step.title}

              onChange={(e) => {

                const copy =
                  [...steps]

                copy[index]
                  .title =
                  e.target.value

                setSteps(copy)
              }}
            />

            <textarea

              value={
                step.description
              }

              onChange={(e) => {

                const copy =
                  [...steps]

                copy[index]
                  .description =
                  e.target.value

                setSteps(copy)
              }}
            />

          </div>
        )
      )}

    </div>
  )
}