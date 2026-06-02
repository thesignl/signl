/**
 * Tiny imperative handle the Navbar uses to open the saved-articles
 * drawer that lives in the SavedPanel component. Keeps the panel
 * portal mounted in the layout while still being trigger-able from
 * any client island without a circular import.
 */
interface SavedPanelControl {
  open: boolean
  setOpen: (v: boolean) => void
}

declare global {
  interface Window {
    __signl_savedPanel?: SavedPanelControl
  }
}

export {}
