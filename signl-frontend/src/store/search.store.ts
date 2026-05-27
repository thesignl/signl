'use client'

import { create }
from 'zustand'

interface SearchStore {

  open: boolean

  query: string

  setQuery: (
    query: string
  ) => void

  openSearch: () => void

  closeSearch: () => void
}

export const useSearchStore =
create<SearchStore>((set) => ({

  open: false,

  query: '',

  setQuery: (
    query
  ) => set({

    query
  }),

  openSearch: () =>
    set({ open: true }),

  closeSearch: () =>
    set({

      open: false,

      query: ''
    })
}))