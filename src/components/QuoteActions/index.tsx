'use client'

import { useDocumentInfo } from '@payloadcms/ui'

export default function QuoteActions() {
  const { id } = useDocumentInfo()
  if (!id) return <p style={{ margin: '16px 0 24px' }}>Save this quote to preview and export it.</p>
  const path = `/quotes/${encodeURIComponent(String(id))}`
  return (
    <div style={{ margin: '16px 0 24px', display: 'flex', gap: 12, alignItems: 'center' }}>
      <a
        className="btn btn--style-primary"
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        style={{ margin: 0 }}
      >
        Open quote / Download PDF
      </a>
      <span>Save changes first. The quote shows the last saved version.</span>
    </div>
  )
}
