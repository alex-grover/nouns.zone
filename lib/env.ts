import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const env = createEnv({
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
})

export default env
