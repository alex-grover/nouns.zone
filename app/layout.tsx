import '@alex-grover/styles/reset.css'
import { GeistSans } from 'geist/font'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import Header from '@/components/header'
import Nav from '@/components/nav'
import ConnectKitConfig from '@/lib/connectkit'
import SWRProvider from '@/lib/swr'
import '@/styles/global.css'
import '@/styles/theme.css'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: 'nouns.zone',
  description: 'All things Nouns on Farcaster',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ConnectKitConfig>
          <Header />
          <div className={styles.content}>
            <Nav />
            <SWRProvider>{children}</SWRProvider>
          </div>
        </ConnectKitConfig>
      </body>
    </html>
  )
}
