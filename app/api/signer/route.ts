import { ViemLocalEip712Signer } from '@farcaster/core'
import { Signer } from '@neynar/nodejs-sdk/build/neynar-api/v2'
import { NextRequest, NextResponse } from 'next/server'
import { fromHex, isHex, toHex } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import db from '@/lib/db'
import env from '@/lib/env'
import neynarClient from '@/lib/neynar/server'
import Session from '@/lib/session'

export type SignerResponse = Signer

export async function GET(request: NextRequest) {
  const { address } = await Session.fromCookies(request.cookies)
  if (!address) return new Response('Unauthorized', { status: 401 })

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('address', '=', address)
    .executeTakeFirst()
  if (!user) return new Response('Not found', { status: 404 })

  const signer = await neynarClient.lookupSigner(user.signer_uuid)

  return NextResponse.json<SignerResponse>(signer)
}

export async function PUT(request: NextRequest) {
  const { address } = await Session.fromCookies(request.cookies)
  if (!address) return new Response('Unauthorized', { status: 401 })

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('address', '=', address)
    .executeTakeFirst()

  if (user) {
    const signer = await neynarClient.lookupSigner(user.signer_uuid)
    return NextResponse.json<SignerResponse>(signer, { status: 202 })
  }

  const generatedSigner = await neynarClient.createSigner()
  if (!isHex(generatedSigner.public_key))
    return new Response('Invalid signer public key', { status: 500 })

  await db
    .insertInto('users')
    .values({ address, signer_uuid: generatedSigner.signer_uuid })
    .execute()

  const deadline = Math.floor(Date.now() / 1000) + 86400
  const viemSigner = new ViemLocalEip712Signer(
    mnemonicToAccount(env.FARCASTER_MNEMONIC),
  )

  const result = await viemSigner.signKeyRequest({
    requestFid: BigInt(env.FARCASTER_ID),
    key: fromHex(generatedSigner.public_key, 'bytes'),
    deadline: BigInt(Math.floor(Date.now() / 1000) + 86400),
  })

  if (!result.isOk())
    return new Response('Error signing key request', { status: 500 })

  const signer = await neynarClient.registerSignedKey(
    generatedSigner.signer_uuid,
    env.FARCASTER_ID,
    deadline,
    toHex(result.value),
  )

  return NextResponse.json<SignerResponse>(signer, { status: 201 })
}
