import { FeedType, FilterType } from '@neynar/nodejs-sdk'
import { FeedResponse } from '@neynar/nodejs-sdk/build/neynar-api/v2'
import { NextResponse } from 'next/server'
import neynarClient from '@/lib/neynar/server'

const NOUNS_PARENT_URL =
  'chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03'

export type CastsResponse = FeedResponse

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get('cursor')
  const feed = await neynarClient.fetchFeed(FeedType.Filter, {
    filterType: FilterType.ParentUrl,
    parentUrl: NOUNS_PARENT_URL,
    cursor: cursor ?? undefined,
  })
  return NextResponse.json<FeedResponse>(feed)
}
