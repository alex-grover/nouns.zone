import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import neynarClient from '@/lib/neynar/server'
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

  const signer = await neynarClient.getSigner(user.signer_uuid)
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
    const signer = await neynarClient.getSigner(user.signer_uuid)
    return NextResponse.json(signer, { status: 202 })
  }

  const signer = await neynarClient.createSigner()
  await db
    .insertInto('users')
    .values({ address, signer_uuid: signer.signer_uuid })
    .execute()

  return NextResponse.json(signer, { status: 201 })
}
