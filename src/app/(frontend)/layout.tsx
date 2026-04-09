import React from 'react'
import Link from 'next/link'
import './globals.css'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 flex flex-col">
        <header className="border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              ChanceCMS
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/" className="hover:text-gray-600 transition-colors">
                Home
              </Link>
              <Link href="/posts" className="hover:text-gray-600 transition-colors">
                Posts
              </Link>
              <Link href="/admin" className="hover:text-gray-600 transition-colors">
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 text-sm text-gray-500">
          <div className="max-w-5xl mx-auto px-4 py-6 text-center">
            Powered by ChanceCMS
          </div>
        </footer>
      </body>
    </html>
  )
}
