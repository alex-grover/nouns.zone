'use client'

import { AuthKitProvider } from '@farcaster/auth-kit'
import { PropsWithChildren } from 'react'

const DOMAIN = 'nouns.zone'

export default function FarcasterConfig({ children }: PropsWithChildren) {
  return (
    <AuthKitProvider config={{ domain: DOMAIN, siweUri: `https://${DOMAIN}` }}>
      {children}
    </AuthKitProvider>
  )
}
