import { NeynarAPIClient } from '@neynar/nodejs-sdk'
import { Hash } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import env from '@/lib/env'

const neynarClient = new NeynarAPIClient(env.NEYNAR_API_KEY)

export default neynarClient

export async function generateSignature(publicKey: Hash) {
  const deadline = Math.floor(Date.now() / 1000) + 86400

  const signature = await mnemonicToAccount(
    env.FARCASTER_MNEMONIC,
  ).signTypedData({
    domain: {
      name: 'Farcaster SignedKeyRequestValidator',
      version: '1',
      chainId: 10,
      verifyingContract: '0x00000000fc700472606ed4fa22623acf62c60553' as const,
    },
    types: {
      SignedKeyRequest: [
        { name: 'requestFid', type: 'uint256' },
        { name: 'key', type: 'bytes' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'SignedKeyRequest',
    message: {
      requestFid: BigInt(env.FARCASTER_ID),
      key: publicKey,
      deadline: BigInt(deadline),
    },
  })

  return { deadline, signature }
}
