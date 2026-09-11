'use client'

import { useState } from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

export default function ServiceLink() {
  const { id } = useDocumentInfo()
  const slug = useFormFields(([fields]) => fields.slug?.value) as string | undefined
  const active = useFormFields(([fields]) => fields.active?.value)
  const [message, setMessage] = useState('')
  if (!id) return <p>Save this service to create its client link.</p>
  const path = `/services/${encodeURIComponent(slug || String(id))}`
  return (
    <div style={{ margin: '16px 0 24px' }}>
      <p>
        Client link:{' '}
        <a href={path} target="_blank" rel="noopener noreferrer">
          {path}
        </a>
      </p>
      <p>
        Save changes before sharing.{' '}
        {active
          ? 'Clients can review this service and pay from this page.'
          : 'Enable “Available on the website” to make this link accessible.'}
      </p>
      <button
        type="button"
        className="btn btn--style-secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(`${window.location.origin}${path}`)
            setMessage('Client link copied.')
          } catch {
            setMessage('Open the link above and copy its address from your browser.')
          }
        }}
      >
        Copy client link
      </button>
      <p role="status">{message}</p>
    </div>
  )
}
