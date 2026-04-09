import React from 'react'
import type { NewsletterBlock as NewsletterBlockProps } from '@/payload-types'

export function NewsletterBlock({ heading, subheading, buttonLabel }: NewsletterBlockProps) {
  return (
    <section style={{ background: 'var(--color-pine)', padding: '88px 52px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <p className="sec-label" style={{ color: 'rgba(240,224,199,0.5)' }}>Stay Informed</p>
        {heading && (
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 400, color: 'var(--color-linen)', marginBottom: 16, lineHeight: 1.15 }}>
            {heading}
          </h2>
        )}
        {subheading && (
          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(240,224,199,0.6)', marginBottom: 40, lineHeight: 1.7 }}>
            {subheading}
          </p>
        )}
        <form style={{ display: 'flex', gap: 0, maxWidth: 480, margin: '0 auto' }} onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            style={{
              flex: 1, padding: '14px 18px',
              background: 'var(--color-cream)',
              border: '1.5px solid rgba(0,38,15,0.18)',
              borderRight: 'none',
              fontFamily: 'var(--font-sans)', fontSize: 14,
              color: 'var(--color-text)',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn-ember" style={{ flexShrink: 0 }}>
            {buttonLabel ?? 'Sign Up'}
          </button>
        </form>
      </div>
    </section>
  )
}
