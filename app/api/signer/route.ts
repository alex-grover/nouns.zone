import { NextRequest, NextResponse } from 'next/server'
import { Hash } from 'viem'
import db from '@/lib/db'
import env from '@/lib/env'
import neynarClient, { generateSignature } from '@/lib/neynar/server'
import Session from '@/lib/session'

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

  return NextResponse.json(signer)
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
    return NextResponse.json(signer, { status: 202 })
  }

  const generatedSigner = await neynarClient.createSigner()
  await db
    .insertInto('users')
    .values({ address, signer_uuid: generatedSigner.signer_uuid })
    .execute()

  const { deadline, signature } = await generateSignature(
    generatedSigner.public_key as Hash,
  )

  const signer = await neynarClient.registerSignedKey(
    generatedSigner.signer_uuid,
    env.FARCASTER_ID,
    deadline,
    signature,
  )

  return NextResponse.json(signer, { status: 201 })
}
