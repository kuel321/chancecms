'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { NavLinks } from '@/components/NavLinks'

type NavPage = { title: string; slug: string }

const navLinkStyle = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  color: 'var(--color-muted)',
  textDecoration: 'none',
}

export function SiteNav({ pages }: { pages: NavPage[] }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <div className="site-nav-right">
        <nav className="site-nav-desktop" aria-label="Main navigation">
          <Link href="/" style={navLinkStyle}>
            Home
          </Link>
          <NavLinks pages={pages} />
          <Link href="/services" style={navLinkStyle}>
            Services
          </Link>
          <Link href="/billing" style={navLinkStyle}>
            Billing
          </Link>
          <Link href="/posts" style={navLinkStyle}>
            Updates
          </Link>
          <Link href="/about" style={navLinkStyle}>
            About
          </Link>
        </nav>

        <button
          type="button"
          className="site-nav-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="site-nav-mobile"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" style={navLinkStyle}>
              Home
            </Link>
            {pages.map((p) => (
              <Link
                key={p.slug}
                href={p.slug === 'home' ? '/' : `/${p.slug}`}
                style={navLinkStyle}
              >
                {p.title}
              </Link>
            ))}
            <Link href="/services" style={navLinkStyle}>
              Services
            </Link>
            <Link href="/billing" style={navLinkStyle}>
              Billing
            </Link>
            <Link href="/posts" style={navLinkStyle}>
              Updates
            </Link>
            <Link href="/about" style={navLinkStyle}>
              About
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
