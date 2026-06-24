import { create } from 'zustand'

interface AdminUiStore {
  sidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

/** Controls the mobile admin sidebar drawer (≤768px). No-op visual on desktop. */
export const useAdminUi = create<AdminUiStore>((set) => ({
  sidebarOpen: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
