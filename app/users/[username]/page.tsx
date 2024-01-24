import { ExternalLinkIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import db from '@/lib/db'
import neynarClient from '@/lib/neynar/server'
import Session from '@/lib/session'
import styles from './page.module.css'

type UserPageProps = {
  params: {
    username: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { address } = await Session.fromCookies(cookies())
  const viewer = address
    ? await db
        .selectFrom('users')
        .selectAll()
        .where('address', '=', address)
        .executeTakeFirst()
    : null
  const signer = viewer && (await neynarClient.lookupSigner(viewer.signer_uuid))
  const viewerFid = signer?.status === 'approved' ? signer.fid : undefined
  const {
    result: { user },
  } = await neynarClient.lookupUserByUsername(params.username, viewerFid)

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <Image
          src={user.pfp.url}
          alt="Profile picture"
          height="96"
          width="96"
          className={styles.pfp}
        />
        <div className={styles.profile}>
          <div className={styles.name}>{user.displayName}</div>
          <div className={styles.username}>@{user.username}</div>
          <div className={styles.follows}>
            <div>
              <span className={styles.count}>{user.followerCount}</span>
              <span> followers</span>
            </div>
            <div>
              <span className={styles.count}>{user.followingCount}</span>
              <span> following</span>
            </div>
          </div>
          <div>{user.profile.bio.text}</div>
        </div>
      </div>
      <div className={styles.content}>
        <div>More coming soon!</div>
        <a
          href={`https://warpcast.com/${user.username}`}
          target="_blank"
          className={styles.link}
        >
          View on Warpcast <ExternalLinkIcon size={16} />
        </a>
      </div>
    </div>
  )
}
