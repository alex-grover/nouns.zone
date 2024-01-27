import { ViemLocalEip712Signer } from '@farcaster/core'
import { type Signer } from '@neynar/nodejs-sdk/build/neynar-api/v2'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { fromHex, isHex, toHex } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { type SessionData, sessionOptions } from '@/lib/auth'
import db from '@/lib/db'
import env from '@/lib/env'
import neynarClient from '@/lib/neynar'

export type SignerResponse = Signer

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return new Response('Unauthorized', { status: 401 })

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('fid', '=', session.id)
    .executeTakeFirst()
  if (!user) return new Response('Not found', { status: 404 })

  const signer = await neynarClient.lookupSigner(user.signer_uuid)

  return NextResponse.json<SignerResponse>(signer)
}

export async function PUT() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return new Response('Unauthorized', { status: 401 })

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('fid', '=', session.id)
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
    .values({ fid: session.id, signer_uuid: generatedSigner.signer_uuid })
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
