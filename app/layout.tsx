import '@alex-grover/styles/reset.css'
import { Analytics } from '@vercel/analytics/react'
import { GeistSans } from 'geist/font'
import type { Metadata, Viewport } from 'next'
import { PropsWithChildren } from 'react'
import Header from '@/components/header'
import Nav, { NavProvider } from '@/components/nav'
import ConnectKitConfig from '@/lib/connectkit'
import SWRProvider from '@/lib/swr'
import '@/styles/global.css'
import '@/styles/theme.css'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'nouns.zone',
  description: 'All things Nouns on Farcaster',
  openGraph: {
    title: 'nouns.zone',
  },
}

export const viewport: Viewport = {
  themeColor: 'white',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ConnectKitConfig>
          <SWRProvider>
            <NavProvider>
              <Header />
              <Nav />
              <main className={styles.main}>{children}</main>
            </NavProvider>
          </SWRProvider>
        </ConnectKitConfig>
        <Analytics />
      </body>
    </html>
  )
}
