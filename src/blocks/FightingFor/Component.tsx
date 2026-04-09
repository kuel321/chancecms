import React from 'react'
import type { FightingForBlock as FightingForBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

export function FightingForBlock({ heading, issues }: FightingForBlockProps) {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        {heading && (
          <h2 className="text-3xl font-bold text-center mb-10">{heading}</h2>
        )}
        {issues && issues.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue, i) => (
              <div key={i} className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{issue.title}</h3>
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
