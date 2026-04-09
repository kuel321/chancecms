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
    <section className="py-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {heading && <h2 className="text-2xl font-bold mb-6">{heading}</h2>}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {links.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 border border-gray-300 rounded-full text-sm hover:border-gray-500 transition-colors"
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
