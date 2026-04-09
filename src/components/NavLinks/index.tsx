'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

type NavPage = { title: string; slug: string }

export function NavLinks({ pages }: { pages: NavPage[] }) {
  const links = pages.map(p => ({
    href: p.slug === 'home' ? '/' : `/${p.slug}`,
    label: p.title,
  }))

  return (
    <>
      {links.map(({ href, label }, i) => (
        <motion.div
          key={href}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
        >
          <Link
            href={href}
            style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--color-muted)',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = 'var(--color-ember)')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--color-muted)')}
          >
            {label}
          </Link>
        </motion.div>
      ))}
    </>
  )
}
