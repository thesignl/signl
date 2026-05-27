'use client'

import useAuthHydration
from '@/hooks/useAuthHydration'

export default function
AuthProvider({

  children

}: {

  children: React.ReactNode
}) {

  useAuthHydration()

  return children
}