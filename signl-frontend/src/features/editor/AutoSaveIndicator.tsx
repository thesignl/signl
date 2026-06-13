'use client'

export default function
AutosaveIndicator({

  isSaving,
  lastSaved

}: {

  isSaving: boolean
  lastSaved?: string
}) {

  if (isSaving) {

    return (
      <span>
        Saving...
      </span>
    )
  }

  if (lastSaved) {

    return (
      <span>

        Saved at

        {' '}

        {lastSaved}

      </span>
    )
  }

  return null
}