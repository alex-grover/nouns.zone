import '@alex-grover/styles/reset.css'
import { Analytics } from '@vercel/analytics/react'
import { GeistSans } from 'geist/font'
import type { Metadata } from 'next'
import { PropsWithChildren } from 'react'
import Header from '@/components/header'
import Nav, { NavProvider } from '@/components/nav'
import QRCodeDialog from '@/components/qr-code-dialog'
import FarcasterConfig from '@/lib/farcaster'
import NeynarProvider from '@/lib/neynar/client'
import SWRProvider from '@/lib/swr'
import ThemeProvider from '@/lib/theme'
import ToastConfig from '@/lib/toast'
import '@farcaster/auth-kit/styles.css'
import '@/styles/global.css'
import '@/styles/theme.css'
import styles from './layout.module.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://nouns.zone'),
  title: 'nouns.zone',
  description: 'All things Nouns on Farcaster',
  openGraph: {
    title: 'nouns.zone',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider>
          <SWRProvider>
            <NeynarProvider>
              <FarcasterConfig>
                <NavProvider>
                  <Header />
                  <Nav />
                  <main className={styles.main}>{children}</main>
                  <QRCodeDialog />
                  <ToastConfig />
                </NavProvider>
              </FarcasterConfig>
            </NeynarProvider>
          </SWRProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
