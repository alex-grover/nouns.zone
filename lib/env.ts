import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const env = createEnv({
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
  },
  server: {
    DATABASE_URL: z.string().min(1),
    FARCASTER_ID: z.string().pipe(z.coerce.number().positive().int()),
    FARCASTER_MNEMONIC: z.string().min(1),
    NEYNAR_API_KEY: z.string().min(1),
    SESSION_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
})

export default env
