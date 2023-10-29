'use client'

import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { PropsWithChildren } from 'react'
import { createConfig, WagmiConfig } from 'wagmi'
import env from '@/lib/env'

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: 'nouns.zone',
    appDescription: 'All things Nouns on Farcaster',
    appUrl: 'https://nouns.zone',
  }),
)

export default function ConnectKitConfig({ children }: PropsWithChildren) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  )
}
