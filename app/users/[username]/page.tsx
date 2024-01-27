import { getIronSession } from 'iron-session'
import { ExternalLinkIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import { type SessionData, sessionOptions } from '@/lib/auth'
import neynarClient from '@/lib/neynar'
import styles from './page.module.css'

type UserPageProps = {
  params: {
    username: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const {
    result: { user },
  } = await neynarClient.lookupUserByUsername(params.username, session.id)

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
