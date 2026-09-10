'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function GalleryPasswordForm({ slug, title }: { slug: string; title: string }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'var(--color-cream)',
    border: '1.5px solid var(--color-rule)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--color-midnight)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/gallery/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '96px auto',
        padding: '48px 40px',
        background: 'var(--color-parchment)',
        border: '1px solid var(--color-rule)',
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-ember)',
          marginBottom: 12,
        }}
      >
        Client Gallery
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 28,
          fontWeight: 400,
          color: 'var(--color-midnight)',
          marginBottom: 24,
          lineHeight: 1.2,
        }}
      >
        {title}
      </h1>
      <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', marginBottom: 24 }}>
        This gallery is password protected. Enter the password you were given to view and download
        the files.
      </p>

      <form onSubmit={handleSubmit}>
        <label
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            marginBottom: 6,
            display: 'block',
          }}
        >
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
          style={inputStyle}
        />

        {error && (
          <p style={{ fontSize: 12, color: 'var(--color-ember)', marginTop: 10 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-dark"
          style={{ marginTop: 20, width: '100%', cursor: loading ? 'default' : 'pointer' }}
        >
          {loading ? 'Checking…' : 'View Gallery'}
        </button>
      </form>
    </div>
  )
}
