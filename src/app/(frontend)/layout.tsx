import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  metadataBase: new URL('https://chasingachance.com'),
  icons: {
    icon: '/media/chance-logo-no-letters-png.png',
    apple: '/media/chance-logo-no-letters-png.png',
  },
}
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NavLinks } from '@/components/NavLinks'
import { ScrollProgress } from '@/components/ScrollProgress'
import { Footer } from '@/components/Footer'
import './globals.css'

async function getPublishedPages() {
  const payload = await getPayload({ config: configPromise })
  const result = await payload
    .find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      select: { title: true, slug: true },
      sort: 'title',
      limit: 20,
    })
    .catch(() => ({ docs: [] }))
  return result.docs
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const pages = await getPublishedPages()

  return (
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="grain-overlay" />
        <ScrollProgress />
        <header className="site-header">
          <Link href="/">
            <div className="logo-and-title">
              <img
                src="/media/chance-logo-no-letters-png.png"
                alt="ChanceCMS"
                className="site-header-logo"
              />
              <div className="logo-title">Chasing a Chance</div>
              <div className="logo-tagline">Big attention. Small studio.</div>
            </div>
          </Link>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                textDecoration: 'none',
              }}
            >
              Home
            </Link>
            <NavLinks pages={pages.map((p) => ({ title: p.title, slug: p.slug }))} />
            <Link
              href="/about"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                textDecoration: 'none',
              }}
            >
              About
            </Link>
          </nav>
        </header>

        <main style={{ flex: 1 }}>{children}</main>

        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Chasing a Chance',
            description: 'Web design and custom software for local businesses in West Virginia.',
            url: 'https://chasingachance.com',
            logo: 'https://chasingachance.com/media/chance-logo-no-letters-png.png',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Hurricane',
              addressRegion: 'WV',
              addressCountry: 'US',
            },
            areaServed: 'West Virginia',
            sameAs: [],
          })}}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J4P4LTCB7Z" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J4P4LTCB7Z');
        `}</Script>
      </body>
    </html>
  )
}
