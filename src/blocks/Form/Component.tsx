import React from 'react'
import type { FormBlock as FormBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

export function FormBlock({ introContent, enableIntro }: FormBlockProps) {
  return (
    <section className="py-12">
      <div className="max-w-2xl mx-auto px-6">
        {enableIntro && introContent && <RichText data={introContent} />}
        <div className="mt-6 p-6 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm text-center">
          Form will render here.
        </div>
      </div>
    </section>
  )
}
