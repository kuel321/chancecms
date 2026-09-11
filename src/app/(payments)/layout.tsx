import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../(frontend)/globals.css'

export const metadata: Metadata = {
  title: 'Your invoice | Chasing a Chance',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
  icons: { icon: '/media/chance-logo-no-letters-png.png' },
}

// A separate root layout keeps private invoice links out of analytics and marketing scripts.
export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: '24px', borderBottom: '1px solid var(--color-rule)' }}>
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              color: 'var(--color-midnight)',
              textDecoration: 'none',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/chance-logo-no-letters-png.png" alt="" width={42} height={42} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24 }}>Chasing a Chance</span>
          </a>
        </header>
        <main style={{ flex: 1 }}>{children}</main>
        <footer
          style={{ textAlign: 'center', padding: 28, color: 'var(--color-muted)', fontSize: 12 }}
        >
          Big attention. Small studio. · Powered by ChanceCMS
        </footer>
      </body>
    </html>
  )
}
