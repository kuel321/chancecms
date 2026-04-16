'use client'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <footer style={{
      background: 'var(--color-midnight)',
      borderTop: '1px solid rgba(240,224,199,0.06)',
    }}>
      {/* Newsletter strip */}
      <div style={{
        borderBottom: '1px solid rgba(240,224,199,0.06)',
        padding: '40px 52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'rgba(240,224,199,0.35)',
            marginBottom: 6,
          }}>
            Free Tips for Local Business Owners
          </p>
          <p style={{
            fontFamily: 'var(--font-serif)', fontSize: 18,
            fontWeight: 400, color: 'var(--color-linen)', lineHeight: 1.2,
          }}>
            Grow your business online. We&apos;ll show you how.
          </p>
        </div>

        {submitted ? (
          <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(240,224,199,0.4)', fontStyle: 'italic' }}>
            You&apos;re in. Talk soon.
          </p>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
            style={{ display: 'flex', gap: 0, flexShrink: 0 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
              style={{
                padding: '12px 16px',
                background: 'rgba(240,224,199,0.06)',
                border: '1px solid rgba(240,224,199,0.12)',
                borderRight: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: 13,
                color: 'var(--color-linen)',
                outline: 'none',
                width: 220,
              }}
            />
            <button type="submit" className="btn-ember" style={{ flexShrink: 0 }}>
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: '36px 52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src="/media/chance-logo-no-letters-png.png"
            alt="Chasing a Chance"
            style={{ height: 44, opacity: 0.6 }}
          />
          <p style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 14, color: 'rgba(240,224,199,0.2)',
          }}>
            Building experiences that matter.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'rgba(240,224,199,0.25)',
            marginBottom: 6,
          }}>
            Powered by ChanceCMS
          </p>
          <a
            href="mailto:chasingachancellc@gmail.com"
            style={{ fontSize: 12, color: 'rgba(240,224,199,0.25)', textDecoration: 'none' }}
          >
            chasingachancellc@gmail.com
          </a>
        </div>
      </div>
    </footer>
  )
}
