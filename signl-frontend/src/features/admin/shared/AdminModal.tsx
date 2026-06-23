'use client'

interface AdminModalProps {
  title: string
  onClose: () => void
  footer?: React.ReactNode
  children: React.ReactNode
}

export default function AdminModal({ title, onClose, footer, children }: AdminModalProps) {
  function handleBgClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="admin-modal-bg" onClick={handleBgClick}>
      <div className="admin-modal">
        <div className="admin-modal-head">
          <span className="admin-modal-title">{title}</span>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-foot">{footer}</div>}
      </div>
    </div>
  )
}
