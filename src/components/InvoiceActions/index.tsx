'use client'

import { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export default function InvoiceActions() {
  const { id } = useDocumentInfo()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [url, setURL] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  return (
    <div style={{ margin: '24px 0' }}>
      <p>
        Save your changes first. This generates a payable invoice from the saved details; it does
        not send an email.
      </p>
      <button
        type="button"
        className="btn btn--style-primary"
        disabled={!id || busy}
        onClick={async () => {
          setBusy(true)
          setError('')
          setCopied(false)
          try {
            const response = await fetch(`/api/billing-invoices/${id}/create-stripe-invoice`, {
              method: 'POST',
              credentials: 'same-origin',
            })
            const data = await response.json()
            if (!response.ok)
              throw new Error(data.errors?.[0]?.message || 'Could not generate invoice')
            setURL(data.url)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
          } finally {
            setBusy(false)
          }
        }}
      >
        {busy ? 'Preparing invoice…' : 'Generate / retrieve client invoice link'}
      </button>
      {url && (
        <div>
          <p>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open client payment link
            </a>{' '}
            — your branded invoice page. Reload this document to see its updated status.
          </p>
          <button
            type="button"
            className="btn btn--style-secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url)
                setCopied(true)
              } catch {
                setError('Open the client link and copy its address from your browser.')
              }
            }}
          >
            {copied ? 'Copied!' : 'Copy client invoice link'}
          </button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  )
}
