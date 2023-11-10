import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import db from '@/lib/db'
import neynarClient from '@/lib/neynar/server'
import Session from '@/lib/session'
import hash from '@/lib/zod/hash'

type Props = {
  params: {
    hash: string
  }
}

const paramsSchema = z.object({
  hash,
})

export async function POST(request: NextRequest, { params }: Props) {
  const { address } = await Session.fromCookies(request.cookies)
  if (!address) return new Response('Unauthorized', { status: 401 })
  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('address', '=', address)
    .executeTakeFirst()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success)
    return NextResponse.json(parseResult.error.format(), { status: 400 })

  await neynarClient.likeCast(user.signer_uuid, parseResult.data.hash)

  return new Response(null, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const { address } = await Session.fromCookies(request.cookies)
  if (!address) return new Response('Unauthorized', { status: 401 })
  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('address', '=', address)
    .executeTakeFirst()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success)
    return NextResponse.json(parseResult.error.format(), { status: 400 })

  await neynarClient.unlikeCast(user.signer_uuid, parseResult.data.hash)

  return new Response(null, { status: 204 })
}
