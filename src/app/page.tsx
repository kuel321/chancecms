import { redirect } from 'next/navigation'

// Redirect root to the Payload admin panel.
// Once you've set up your site, replace this with your homepage component.
export default function RootPage() {
  redirect('/admin')
}
