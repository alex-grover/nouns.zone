import * as Popover from '@radix-ui/react-popover'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  ExternalLinkIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
} from 'lucide-react'
import Image from 'next/image'
import { type Cast } from 'neynar-next/server'
import styles from './cast.module.css'
import LikeButton from './like-button'
import RecastButton from './recast-button'

dayjs.extend(relativeTime)

type CastProps = {
  cast: Cast
}

export default function Cast({ cast }: CastProps) {
  return (
    <div className={styles.cast}>
      <div className={styles.content}>
        <Image
          src={cast.author.pfp_url}
          alt="PFP"
          width="30"
          height="30"
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
            <RecastButton cast={cast} className={styles.reaction} />
            <LikeButton cast={cast} className={styles.reaction} />
          </div>
        </div>
      </div>
      <Popover.Root>
        <Popover.Trigger className={styles.trigger}>
          <MoreVerticalIcon size={16} />
        </Popover.Trigger>
        <Popover.Content className={styles.popover}>
          <a
            href={`https://warpcast.com/${
              cast.author.username
            }/${cast.hash.slice(0, 8)}`}
            target="_blank"
            className={styles.button}
          >
            View on Warpcast
            <ExternalLinkIcon size={16} />
          </a>
          <Popover.Arrow className={styles.arrow} />
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
