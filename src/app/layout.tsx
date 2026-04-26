import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevPath',
  description: 'AI-Powered Career Roadmaps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
