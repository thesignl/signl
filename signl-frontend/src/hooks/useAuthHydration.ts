'use client'

import { useEffect }
from 'react'

import {
  useAuthStore
}
from '@/store/auth.store'

export default function
useAuthHydration() {

  const setAuth =
    useAuthStore(
      state => state.setAuth
    )

  useEffect(() => {

    const token =
      localStorage.getItem(
        'token'
      )

    const user =
      localStorage.getItem(
        'user'
      )

    if (token && user) {

      setAuth(

        JSON.parse(user),

        token
      )
    }

  }, [])
}