import React from 'react'
import type { MeetTheCandidateBlock as MeetTheCandidateBlockProps, Media } from '@/payload-types'
import RichText from '@/components/RichText'

export function MeetTheCandidateBlock({ heading, bio, image }: MeetTheCandidateBlockProps) {
  const imageUrl = image && typeof image === 'object' ? (image as Media).url : null

  return (
    <section style={{ background: 'var(--color-cream)', borderTop: '1px solid var(--color-rule)', borderBottom: '1px solid var(--color-rule)', padding: '88px 52px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
        {imageUrl && (
          <div style={{ flexShrink: 0 }}>
            <img src={imageUrl} alt={heading ?? 'Candidate'} style={{
              width: 280, height: 340, objectFit: 'cover',
              display: 'block',
            }} />
          </div>
        )}
        <div style={{ flex: '1 1 320px' }}>
          {heading && (
            <>
              <p className="sec-label">Meet the Candidate</p>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 400, color: 'var(--color-midnight)', marginBottom: 24, lineHeight: 1.15 }}>
                {heading}
              </h2>
            </>
          )}
          {bio && <RichText data={bio} enableGutter={false} />}
        </div>
      </div>
    </section>
  )
}
