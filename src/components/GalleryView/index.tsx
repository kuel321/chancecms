import type { ClientFile } from '@/payload-types'

const linkStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'var(--color-pine)',
  textDecoration: 'none',
}

function formatBytes(bytes?: number | null): string {
  if (!bytes) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(value < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

function FileCard({ file }: { file: ClientFile }) {
  const isImage = file.mimeType?.startsWith('image/')
  const isVideo = file.mimeType?.startsWith('video/')
  const previewUrl = file.sizes?.thumbnail?.url || file.url

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          aspectRatio: '4/3',
          background: 'var(--color-cream)',
          border: '1px solid var(--color-rule)',
          overflow: 'hidden',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.alt || file.filename || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : isVideo && file.url ? (
          <video
            src={file.url}
            controls
            preload="metadata"
            style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }}
          />
        ) : (
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            File
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: 12,
          fontWeight: 400,
          color: 'var(--color-midnight)',
          marginBottom: 4,
          wordBreak: 'break-word',
        }}
      >
        {file.filename}
      </p>
      {file.filesize ? (
        <p style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 10 }}>
          {formatBytes(file.filesize)}
        </p>
      ) : null}

      <div style={{ display: 'flex', gap: 16, marginTop: 'auto' }}>
        {file.url && (
          <a href={file.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            View
          </a>
        )}
        {file.url && (
          <a href={file.url} download style={linkStyle}>
            Download
          </a>
        )}
      </div>
    </div>
  )
}

export function GalleryView({
  title,
  note,
  slug,
  files,
}: {
  title: string
  note?: string | null
  slug: string
  files: ClientFile[]
}) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 96px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 24,
          marginBottom: 16,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-ember)',
              marginBottom: 8,
            }}
          >
            Client Gallery
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 400,
              color: 'var(--color-midnight)',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h1>
        </div>
        {files.length > 0 && (
          <a href={`/api/gallery/${slug}/download`} className="btn-dark">
            Download All (.zip)
          </a>
        )}
      </div>

      {note && (
        <p
          style={{
            fontSize: 14,
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--color-muted)',
            maxWidth: 640,
            marginBottom: 40,
          }}
        >
          {note}
        </p>
      )}

      {files.length === 0 ? (
        <p style={{ color: 'var(--color-muted)', fontWeight: 300, fontStyle: 'italic' }}>
          No files have been added to this gallery yet.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 28,
            marginTop: 40,
          }}
        >
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
    </div>
  )
}
