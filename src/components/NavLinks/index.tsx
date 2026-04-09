'use client'
import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'News' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function NavLinks() {
  return (
    <>
      {links.map(({ href, label }) => (
        <Link
          key={href}
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
      ))}
    </>
  )
}
