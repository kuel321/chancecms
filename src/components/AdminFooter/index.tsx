import React from 'react'

export default function AdminFooter() {
  return (
    <div
      style={{
        borderTop: '1px solid var(--theme-elevation-100)',
        marginTop: 'auto',
        padding: '16px',
        fontSize: '11px',
        color: 'var(--theme-elevation-500)',
        lineHeight: '1.5',
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>ChanceCMS by Chasing a Chance, LLC.</p>
      <p style={{ margin: '4px 0 0' }}>
        Please email{' '}
        <a
          href="mailto:chasingachancellc@gmail.com"
          style={{ color: 'var(--theme-elevation-500)' }}
        >
          chasingachancellc@gmail.com
        </a>{' '}
        for support.
      </p>
    </div>
  )
}
