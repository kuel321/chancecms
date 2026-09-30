import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../(frontend)/globals.css'
import './quote.css'

export const metadata: Metadata = {
  title: 'Quote | Chasing a Chance',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
  icons: { icon: '/media/chance-logo-no-letters-png.png' },
}

// A separate root layout keeps site chrome and analytics out of the printable quote.
export default function QuoteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="quote-body">{children}</body>
    </html>
  )
}
