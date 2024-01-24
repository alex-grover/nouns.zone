import { createAppClient, viemConnector } from '@farcaster/auth-client'
import { SessionOptions } from 'iron-session'
import env from '@/lib/env'

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
