import { ReactionType } from '@neynar/nodejs-sdk'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { type SessionData, sessionOptions } from '@/lib/auth'
import db from '@/lib/db'
import neynarClient from '@/lib/neynar'
import hexString from '@/lib/zod/hex-string'

type Props = {
  params: {
    hash: string
  }
}

const paramsSchema = z.object({
  hash: hexString,
})

export async function POST(_: Request, { params }: Props) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return new Response('Unauthorized', { status: 401 })

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('fid', '=', session.id)
    .executeTakeFirst()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success)
    return Response.json(parseResult.error.format(), { status: 400 })

  await neynarClient.publishReactionToCast(
    user.signer_uuid,
    ReactionType.Like,
    parseResult.data.hash,
  )

  return new Response(null, { status: 201 })
}

export async function DELETE(_: Request, { params }: Props) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return new Response('Unauthorized', { status: 401 })

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('fid', '=', session.id)
    .executeTakeFirst()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success)
    return Response.json(parseResult.error.format(), { status: 400 })

  await neynarClient.deleteReactionFromCast(
    user.signer_uuid,
    ReactionType.Like,
    parseResult.data.hash,
  )

  return new Response(null, { status: 204 })
}
