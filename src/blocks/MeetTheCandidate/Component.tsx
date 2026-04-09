import React from 'react'
import type { MeetTheCandidateBlock as MeetTheCandidateBlockProps, Media } from '@/payload-types'
import RichText from '@/components/RichText'

export function MeetTheCandidateBlock({ heading, bio, image }: MeetTheCandidateBlockProps) {
  const imageUrl = image && typeof image === 'object' ? (image as Media).url : null

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-10 items-center">
        {imageUrl && (
          <div className="flex-shrink-0">
            <img
              src={imageUrl}
              alt={heading ?? 'Candidate'}
              className="w-64 h-64 object-cover rounded-full shadow-md"
            />
          </div>
        )}
        <div className="flex-1">
          {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
          {bio && <RichText data={bio} enableGutter={false} />}
        </div>
      </div>
    </section>
  )
}
