import { createAppClient, viemConnector } from '@farcaster/auth-client'
import { type SessionOptions } from 'iron-session'
import env from '@/lib/env'

export type SessionData =
  | {
      id: number
      username: string
      pfpUrl: string
    }
  | Record<string, never>

export const sessionOptions: SessionOptions = {
  cookieName: 'nouns-zone',
  password: env.SESSION_SECRET,
  cookieOptions: {
    secure: env.VERCEL_ENV !== 'development',
  },
}

export const authClient = createAppClient({
  ethereum: viemConnector(),
})
