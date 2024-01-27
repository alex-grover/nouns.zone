import { NeynarAPIClient } from '@neynar/nodejs-sdk'
import env from '@/lib/env'

const neynarClient = new NeynarAPIClient(env.NEYNAR_API_KEY)

export default neynarClient
