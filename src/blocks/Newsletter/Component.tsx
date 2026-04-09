import React from 'react'
import type { NewsletterBlock as NewsletterBlockProps } from '@/payload-types'

export function NewsletterBlock({ heading, subheading, buttonLabel }: NewsletterBlockProps) {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {heading && <h2 className="text-3xl font-bold mb-3">{heading}</h2>}
        {subheading && <p className="text-gray-300 mb-8">{subheading}</p>}
        <form className="flex flex-col sm:flex-row gap-3 justify-center" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 max-w-sm px-4 py-3 rounded text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-white text-gray-900 px-6 py-3 rounded font-medium hover:bg-gray-100 transition-colors"
          >
            {buttonLabel ?? 'Sign Up'}
          </button>
        </form>
      </div>
    </section>
  )
}
