import React from 'react'
import { cn } from '@/utilities/ui'

export type CodeBlockProps = {
  language?: string | null
  code: string
}

export function CodeBlock({ code, language, className }: CodeBlockProps & { className?: string }) {
  return (
    <div className={cn('my-6', className)}>
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
      {language && (
        <p className="text-xs text-gray-400 mt-1 text-right">{language}</p>
      )}
    </div>
  )
}
