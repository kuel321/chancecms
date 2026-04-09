import React from 'react'
import type { SocialMediaBlock as SocialMediaBlockProps } from '@/payload-types'

const platformLabels: Record<string, string> = {
  facebook: 'Facebook',
  twitter: 'Twitter / X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
}

export function SocialMediaBlock({ heading, links }: SocialMediaBlockProps) {
  return (
    <section style={{ background: 'var(--color-parchment)', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)', padding: '64px 52px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        {heading && <h2 className="sec-heading" style={{ marginBottom: 32 }}>{heading}</h2>}
        {links && links.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {links.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                {platformLabels[item.platform] ?? item.platform}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
