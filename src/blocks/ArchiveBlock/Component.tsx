import React from 'react'
import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

export function ArchiveBlock({ introContent }: ArchiveBlockProps) {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-6">
        {introContent && <RichText data={introContent} />}
        <p className="text-gray-400 text-sm mt-4 italic">
          Archive content will appear here once pages are published.
        </p>
      </div>
    </section>
  )
}
