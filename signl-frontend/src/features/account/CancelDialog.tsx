'use client'

import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

interface CancelDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  confirming: boolean
  accessUntil: string | null
}

function fmtDate(dateStr: string | null): string | null {
  if (!dateStr) return null
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function CancelDialog({
  open,
  onClose,
  onConfirm,
  confirming,
  accessUntil,
}: CancelDialogProps) {
  const date = fmtDate(accessUntil)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Cancel subscription"
      panelClassName="cancel-dialog"
    >
      <div className="dialog-body">
        <p className="cancel-dialog-text">
          Are you sure you want to cancel your Signl Pro subscription?
        </p>
        {date && (
          <div className="cancel-access-note">
            You will retain full Pro access until <strong>{date}</strong>.
            After that, your account returns to the Free plan.
          </div>
        )}
        <div className="cancel-dialog-actions">
          <Button variant="ghost" onClick={onClose} disabled={confirming}>
            Keep subscription
          </Button>
          <Button variant="secondary" onClick={onConfirm} loading={confirming}>
            Cancel anyway
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
