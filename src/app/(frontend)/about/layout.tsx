import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Chasing a Chance — Hurricane, WV',
  description: 'The story behind Chasing a Chance — a web design company named after a dog, built in Hurricane, WV to help local businesses get online.',
  alternates: {
    canonical: 'https://chasingachance.com/about',
  },
  openGraph: {
    title: 'About | Chasing a Chance',
    description: 'The story behind Chasing a Chance — a web design company named after a dog, built in Hurricane, WV.',
    url: 'https://chasingachance.com/about',
    siteName: 'Chasing a Chance',
    images: [{ url: '/meta-image.jpg', width: 1200, height: 630, alt: 'About Chasing a Chance' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Chasing a Chance',
    description: 'The story behind Chasing a Chance — a web design company named after a dog, built in Hurricane, WV.',
    images: ['/meta-image.jpg'],
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
