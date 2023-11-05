'use client'

import {
  ConnectKitProvider,
  getDefaultConfig,
  SIWEConfig,
  SIWEProvider,
} from 'connectkit'
import { useTheme } from 'next-themes'
import { PropsWithChildren } from 'react'
import { SiweMessage } from 'siwe'
import { createConfig, mainnet, WagmiConfig } from 'wagmi'
import env from '@/lib/env'
import { useSigner } from '@/lib/neynar/client'
import { SerializedSession } from '@/lib/session'

const SIWE_API_PATH = '/api/siwe'

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: 'nouns.zone',
    appDescription: 'All things Nouns on Farcaster',
    appUrl: 'https://nouns.zone',
  }),
)

const siweConfig = {
  getNonce: async () => {
    const res = await fetch(SIWE_API_PATH, { method: 'PUT' })
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce')
    return res.text()
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      uri: window.location.origin,
      domain: window.location.host,
      statement: 'Sign In With Ethereum to prove you control this wallet.',
    }).prepareMessage()
  },
  verifyMessage: async ({ message, signature }) => {
    const res = await fetch(SIWE_API_PATH, {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
      headers: { 'Content-Type': 'application/json' },
    })
    return res.ok
  },
  getSession: async () => {
    const res = await fetch(SIWE_API_PATH)
    if (!res.ok) throw new Error('Failed to fetch SIWE session')
    const { address, chainId } = (await res.json()) as SerializedSession
    return address && chainId ? { address, chainId } : null
  },
  signOut: async () => {
    const res = await fetch(SIWE_API_PATH, { method: 'DELETE' })
    return res.ok
  },
} satisfies SIWEConfig

export default function ConnectKitConfig({ children }: PropsWithChildren) {
  const { resolvedTheme } = useTheme()
  const { fetchSigner, clearSigner } = useSigner()

  return (
    <WagmiConfig config={config}>
      <SIWEProvider
        {...siweConfig}
        onSignIn={fetchSigner}
        onSignOut={clearSigner}
      >
        <ConnectKitProvider mode={resolvedTheme === 'light' ? 'light' : 'dark'}>
          {children}
        </ConnectKitProvider>
      </SIWEProvider>
    </WagmiConfig>
  )
}
