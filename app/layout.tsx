import '@alex-grover/styles/reset.css'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'nouns.zone',
  description: 'All things Nouns on Farcaster',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
