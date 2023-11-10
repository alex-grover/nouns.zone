import { HeartIcon } from 'lucide-react'
import type { Cast } from 'neynar-next/server'
import { HTMLAttributes, useCallback, useState } from 'react'
import { useSigner } from '@/lib/neynar/client'
import styles from './like-button.module.css'

type LikeButtonProps = HTMLAttributes<HTMLSpanElement> & {
  cast: Cast
}

export default function LikeButton({ cast, ...props }: LikeButtonProps) {
  const { signer } = useSigner()

  const [liked, setLiked] = useState(
    () =>
      signer?.status === 'approved' &&
      !!cast.reactions.likes.find((like) => like.fid === signer.fid),
  )
  const [likeCount, setLikeCount] = useState(cast.reactions.likes.length)

  const handleLike = useCallback(() => {
    async function execute() {
      try {
        setLiked(true)
        setLikeCount((curr) => curr + 1)
        await fetch(`/api/casts/${cast.hash}/like`, { method: 'POST' })
      } catch (e) {
        setLiked(false)
        setLikeCount((curr) => curr - 1)
        // TODO: toast
      }
    }

    void execute()
  }, [cast])

  const handleUnlike = useCallback(() => {
    async function execute() {
      try {
        setLiked(false)
        setLikeCount((curr) => curr - 1)
        await fetch(`/api/casts/${cast.hash}/like`, { method: 'DELETE' })
      } catch (e) {
        setLiked(true)
        setLikeCount((curr) => curr + 1)
        // TODO: toast
      }
    }

    void execute()
  }, [cast])

  return (
    <span {...props}>
      <button
        onClick={liked ? handleUnlike : handleLike}
        disabled={signer?.status !== 'approved'}
      >
        <HeartIcon size={16} className={styles.icon} data-liked={liked} />
      </button>
      {likeCount}
    </span>
  )
}
