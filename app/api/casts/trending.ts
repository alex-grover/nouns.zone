import channels from 'farcaster-channels#61bcbe07a1b12ba91103cff9a15735bb76b03021/warpcast.json'
import { FeedResponse } from 'neynar-next/server'
import { Address } from 'viem'
import groupBy from '@/lib/arrays/group-by'
import { replicatorDb } from '@/lib/db/client'
import { ReactionType } from '@/lib/reactions'

const nounsChannel = channels.find((channel) => channel.name === 'Nouns')
if (!nounsChannel) throw new Error('Nouns channel not found')
const nounsParentUrl = nounsChannel.parent_url

export default async function getTrendingFeed(
  cursor?: string | null,
): Promise<FeedResponse> {
  // TODO: fetch follows separately to improve performance
  let query = replicatorDb
    .selectFrom('casts as cast')
    .innerJoin('profileWithAddresses as profile', 'cast.fid', 'profile.fid')
    .leftJoin('casts as reply', 'cast.hash', 'reply.parentHash')
    // .leftJoin('links as follower', 'follower.targetFid', 'profile.fid')
    // .leftJoin('links as follow', 'follow.fid', 'profile.fid')
    .select(({ fn }) => [
      'cast.hash',
      'cast.rootParentHash',
      'cast.parentHash',
      'cast.parentUrl',
      'cast.parentFid',
      'cast.text',
      'cast.timestamp',
      'cast.embeds',
      'cast.parentFid',
      'profile.fid',
      'profile.fname',
      'profile.displayName',
      'profile.avatarUrl',
      'profile.bio',
      'profile.verifiedAddresses',
      fn.count<string>('reply.id').as('replies'),
      // fn.count<string>('follower.id').as('followers'),
      // fn.count<string>('follow.id').as('follows'),
    ])
    .where('cast.parentUrl', '=', nounsParentUrl)
    .where('cast.deletedAt', 'is', null)
    .where('reply.deletedAt', 'is', null)
    // .where('follow.deletedAt', 'is', null)
    // .where('follower.deletedAt', 'is', null)
    .groupBy([
      'cast.hash',
      'cast.rootParentHash',
      'cast.parentHash',
      'cast.parentUrl',
      'cast.parentFid',
      'cast.text',
      'cast.timestamp',
      'cast.embeds',
      'cast.parentFid',
      'profile.fid',
      'profile.fname',
      'profile.displayName',
      'profile.avatarUrl',
      'profile.bio',
      'profile.verifiedAddresses',
    ])
    .orderBy('cast.timestamp desc') // TODO: order by date_trunc(day), likes - maybe in memory
    .limit(20)

  if (cursor) query = query.where('cast.timestamp', '<', new Date(cursor))

  const casts = await query.execute()

  const reactions = await replicatorDb
    .selectFrom('reactions')
    .innerJoin(
      'profileWithAddresses as profile',
      'profile.fid',
      'reactions.fid',
    )
    .select([
      'reactions.targetHash',
      'reactions.fid',
      'reactions.reactionType',
      'profile.fname',
    ])
    .where(
      'targetHash',
      'in',
      casts.map((cast) => cast.hash),
    )
    .execute()

  const likes = reactions.filter(
    (reaction) => reaction.reactionType === Number(ReactionType.LIKE),
  )
  const recasts = reactions.filter(
    (reaction) => reaction.reactionType === Number(ReactionType.RECAST),
  )

  const groupedLikes = groupBy(
    likes,
    (like) => `0x${like.targetHash?.toString('hex')}`,
  )
  const groupedRecasts = groupBy(
    recasts,
    (recast) => `0x${recast.targetHash?.toString('hex')}`,
  )

  return {
    casts: casts.map((cast) => ({
      hash: `0x${cast.hash.toString('hex')}`,
      thread_hash:
        cast.rootParentHash && `0x${cast.rootParentHash.toString('hex')}`,
      parent_hash: cast.parentHash && `0x${cast.parentHash.toString('hex')}`,
      parent_url: cast.parentUrl,
      parent_author: {
        fid: cast.parentFid ? Number(cast.parentFid) : null,
      },
      author: {
        fid: Number(cast.fid),
        username: cast.fname ?? `!${cast.fid}`,
        display_name: cast.displayName ?? cast.fname ?? `!${cast.fid}`,
        pfp_url: cast.avatarUrl ?? '', // TODO: fallback avatar
        profile: {
          bio: {
            text: cast.bio ?? "I'm a little teapot ⌐◨-◨",
          },
        },
        follower_count: 0, // Number(cast.followers),
        following_count: 0, // Number(cast.follows),
        verifications: cast.verifiedAddresses as Address[],
        active_status: 'inactive', // We don't use this
      },
      text: cast.text,
      timestamp: cast.timestamp.toISOString(), // TODO: timestamps seem to be all wrong
      embeds: cast.embeds as { url: string }[],
      reactions: {
        likes:
          groupedLikes.get(`0x${cast.hash.toString('hex')}`)?.map((like) => ({
            fid: Number(like.fid),
          })) ?? [],
        recasts:
          groupedRecasts
            .get(`0x${cast.hash.toString('hex')}`)
            ?.map((recast) => ({
              fid: Number(recast.fid),
              fname: recast.fname ?? `!${recast.fid}`,
            })) ?? [],
      },
      replies: {
        count: Number(cast.replies),
      },
    })),
    next: {
      cursor: casts.at(-1)?.timestamp.toISOString() ?? '',
    },
  }
}
