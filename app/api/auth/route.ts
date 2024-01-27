import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authClient, type SessionData, sessionOptions } from '@/lib/auth'
import neynarClient from '@/lib/neynar'
import hexString from '@/lib/zod/hex-string'

export type SessionResponse = SessionData

export async function GET() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.id) return Response.json({})
  return NextResponse.json<SessionResponse>(session)
}

const loginSchema = z.object({
  message: z.string().min(1),
  signature: hexString,
  nonce: z.string().min(1),
})
export type LoginSchema = z.input<typeof loginSchema>

export async function POST(request: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = await request.json()

  const parseResult = loginSchema.safeParse(json)
  if (!parseResult.success)
    return Response.json('Invalid credentials', { status: 422 })

  const { success, fid } = await authClient.verifySignInMessage({
    message: parseResult.data.message,
    signature: parseResult.data.signature,
    nonce: parseResult.data.nonce,
    domain: 'nouns.zone',
  })

  if (!success) return Response.json('Invalid signature', { status: 422 })

  const [
    session,
    {
      result: { user },
    },
  ] = await Promise.all([
    getIronSession<SessionData>(cookies(), sessionOptions),
    neynarClient.lookupUserByFid(fid),
  ])

  session.id = user.fid
  session.username = user.username
  session.pfpUrl = user.pfp.url

  await session.save()

  return NextResponse.json<SessionResponse>(session, { status: 201 })
}

export async function DELETE() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  session.destroy()
  return NextResponse.json<SessionResponse>({}, { status: 202 })
}
