import React from 'react'
import type { FightingForBlock as FightingForBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

export function FightingForBlock({ heading, issues }: FightingForBlockProps) {
  return (
    <section style={{ padding: '88px 52px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {heading && (
          <>
            <p className="sec-label">Platform</p>
            <h2 className="sec-heading">{heading}</h2>
          </>
        )}
        {issues && issues.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {issues.map((issue, i) => (
              <div key={i} style={{
                background: 'var(--color-cream)',
                border: '1px solid var(--color-rule)',
                padding: '32px 28px',
              }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(241,90,36,0.1)',
                  color: 'var(--color-ember)',
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '4px 10px', marginBottom: 16,
                }}>
                  0{i + 1}
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--color-midnight)', marginBottom: 12, lineHeight: 1.35 }}>
                  {issue.title}
                </h3>
                {issue.description && (
                  <RichText data={issue.description} enableGutter={false} enableProse={false} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
