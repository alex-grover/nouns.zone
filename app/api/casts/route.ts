import { NextResponse } from 'next/server'
import { FeedResponse } from 'neynar-next/server'
import getTrendingFeed from '@/app/api/casts/trending'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')
  const feed = await getTrendingFeed(cursor)
  return NextResponse.json<FeedResponse>(feed)
}
