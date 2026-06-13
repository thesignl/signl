'use client'

import { useEffect }
from 'react'

export default function
useAutosave(

  callback: () => void,

  deps: any[]

) {

  useEffect(() => {

    const timeout =
      setTimeout(

        callback,

        1500
      )

    return () =>
      clearTimeout(timeout)

  }, deps)
}