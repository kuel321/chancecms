import Link from 'next/link'

export default function NotFound() {
  return (
    <section
      style={{
        minHeight: '80vh',
        background: 'var(--color-pine)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '60px 24px',
      }}
    >
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,224,199,0.5)', marginBottom: 24 }}>
        404
      </p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 400, color: 'var(--color-linen)', lineHeight: 1.15, marginBottom: 24 }}>
        Page not found.
      </h1>
      <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(240,224,199,0.55)', maxWidth: 400, lineHeight: 1.8, marginBottom: 44 }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/" className="btn-ember">
        Back to home
      </Link>
    </section>
  )
}
