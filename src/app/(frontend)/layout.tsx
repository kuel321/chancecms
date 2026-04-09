import React from 'react'
import Link from 'next/link'
import { NavLinks } from '@/components/NavLinks'
import './globals.css'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Nav */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(240,224,199,0.96)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--color-rule)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 52px',
        }}>
          <Link href="/">
            <img src="/media/chance-logo-no-letters-png.png" alt="ChanceCMS" style={{ height: 46 }} />
          </Link>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <NavLinks />
            <Link href="/admin" className="btn-dark" style={{ padding: '9px 20px' }}>
              Admin
            </Link>
          </nav>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        {/* Footer */}
        <footer style={{
          background: 'var(--color-midnight)',
          padding: '52px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(240,224,199,0.06)',
        }}>
          <img src="/media/chance-logo-no-letters-png.png" alt="ChanceCMS" style={{ height: 60, opacity: 0.7 }} />
          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'rgba(240,224,199,0.4)',
              marginBottom: 8,
            }}>
              Powered by ChanceCMS
            </p>
            <p style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 15, color: 'rgba(240,224,199,0.2)',
            }}>
              Built for campaigns that matter.
            </p>
          </div>
        </footer>

      </body>
    </html>
  )
}
