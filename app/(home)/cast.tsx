import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { HeartIcon, MessageCircleIcon, RepeatIcon } from 'lucide-react'
import Image from 'next/image'
import { type Cast } from 'neynar-next/server'
import styles from './cast.module.css'

dayjs.extend(relativeTime)

type CastProps = {
  cast: Cast
}

export default function Cast({ cast }: CastProps) {
  return (
    <div className={styles.cast}>
      <Image
        src={cast.author.pfp_url}
        alt="PFP"
        width="30"
        height="30"
        objectFit="cover"
        className={styles.pfp}
      />
      <div>
        <div className={styles.author}>
          <span className={styles.display}>{cast.author.display_name}</span>
          <span className={styles.username}>
            @{cast.author.username} &bull; {dayjs(cast.timestamp).fromNow()}
          </span>
        </div>
        <div>{cast.text}</div>
        <div className={styles.reactions}>
          <span className={styles.reaction}>
            <MessageCircleIcon size={16} /> {cast.replies.count}
          </span>
          <span className={styles.reaction}>
            <RepeatIcon size={16} /> {cast.reactions.recasts.length}
          </span>
          <span className={styles.reaction}>
            <HeartIcon size={16} /> {cast.reactions.likes.length}
          </span>
        </div>
      </div>
    </div>
  )
}
