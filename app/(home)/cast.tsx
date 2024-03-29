import {
  type CastWithInteractions,
  type EmbedUrl,
} from '@neynar/nodejs-sdk/build/neynar-api/v2'
import * as Popover from '@radix-ui/react-popover'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import updateLocale from 'dayjs/plugin/updateLocale'
import {
  ExternalLinkIcon,
  MessageCircleIcon,
  MoreVerticalIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import styles from './cast.module.css'
import LikeButton from './like-button'
import RecastButton from './recast-button'

dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    past: '%s',
    s: '1s',
    ss: '%ds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy',
  },
})

type CastProps = {
  cast: CastWithInteractions
}

export default function Cast({ cast }: CastProps) {
  const imageEmbeds = useMemo(
    () =>
      cast.embeds.filter(
        (embed): embed is EmbedUrl =>
          'url' in embed && embed.url.includes('i.imgur.com'),
      ),
    [cast.embeds],
  )

  // Users without complete profiles break cast display, and seem to be spam
  if (!cast.author.username) return null

  return (
    <div className={styles.cast}>
      <div className={styles.content}>
        <Link href={`/users/${cast.author.username}`} className={styles.link}>
          <Image
            src={cast.author.pfp_url}
            alt="PFP"
            width="30"
            height="30"
            className={styles.pfp}
          />
        </Link>
        <div className={styles.body}>
          <Link
            href={`/users/${cast.author.username}`}
            className={styles.author}
          >
            <span className={styles.display}>{cast.author.display_name}</span>
            <span className={styles.username}>@{cast.author.username}</span>
          </Link>
          <span className={styles.timestamp}>
            {' '}
            &bull; {dayjs(cast.timestamp).fromNow(true)}
          </span>
          <div className={styles.text}>{cast.text}</div>
          {imageEmbeds.length > 0 && (
            <div className={styles.embeds}>
              {imageEmbeds.map(({ url }) => (
                <div key={url} className={styles.embed}>
                  <Image
                    src={url}
                    alt="Cast image"
                    fill
                    className={styles.image}
                  />
                </div>
              ))}
            </div>
          )}
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
