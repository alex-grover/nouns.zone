import NeynarClient from 'neynar-next/server'
import env from '@/lib/env'

// TODO: using @later - change
const neynarClient = new NeynarClient(
  env.NEYNAR_API_KEY,
  env.FARCASTER_ID,
  env.FARCASTER_MNEMONIC,
)

export default neynarClient
