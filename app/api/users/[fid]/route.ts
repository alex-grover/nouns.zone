import { NextResponse } from 'next/server'
import { z } from 'zod'
import neynarClient from '@/lib/neynar/server'

type Props = {
  params: {
    fid: string
  }
}

const paramsSchema = z.object({
  fid: z.string().pipe(z.coerce.number().positive()),
})

export async function GET(_: Request, { params }: Props) {
  const parseResult = paramsSchema.safeParse(params)
  if (!parseResult.success) return NextResponse.json(parseResult.error.format())

  const user = await neynarClient.getUserByFid(parseResult.data.fid)

  return NextResponse.json(user)
}
