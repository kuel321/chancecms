'use client'

import { useRef, useState } from 'react'

export function CheckoutButton({
  offerID,
  subscription,
}: {
  offerID: number
  subscription: boolean
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const requestID = useRef<string | null>(null)
  return (
    <div>
      <button
        className="btn-ember"
        disabled={busy}
        onClick={async () => {
          if (busy) return
          setBusy(true)
          setError('')
          requestID.current ??= crypto.randomUUID()
          try {
            const response = await fetch('/api/stripe/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ offerID, requestID: requestID.current }),
            })
            const result = await response.json()
            if (!response.ok || !result.url)
              throw new Error(result.error || 'Checkout is unavailable.')
            window.location.assign(result.url)
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Checkout is unavailable.')
            setBusy(false)
          }
        }}
      >
        {busy ? 'Opening checkout…' : subscription ? 'Subscribe' : 'Buy now'}
      </button>
      {error && (
        <p role="alert" style={{ marginTop: 12 }}>
          {error}
        </p>
      )}
    </div>
  )
}
