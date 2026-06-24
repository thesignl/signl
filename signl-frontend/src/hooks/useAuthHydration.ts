'use client'

import { useEffect } from 'react'

import { useAuthStore } from '@/store/auth.store'

/**
 * Restores the auth session from localStorage on first client mount.
 * Delegates to the store's `hydrate()` so the storage-key contract lives
 * in exactly one place (the store + axios helpers).
 */
export default function useAuthHydration() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])
}
