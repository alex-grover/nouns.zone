import { type CastWithInteractions } from '@neynar/nodejs-sdk/build/neynar-api/v2'
import { HeartIcon } from 'lucide-react'
import {
  type HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'
import useSession from '@/lib/auth/client'
import { useSigner } from '@/lib/neynar/client'
import styles from './like-button.module.css'

type LikeButtonProps = HTMLAttributes<HTMLSpanElement> & {
  cast: CastWithInteractions
}

export default function LikeButton({ cast, ...props }: LikeButtonProps) {
  const { session } = useSession()
  const { signer, isLoading } = useSigner()

  const hasNoggles = useMemo(() => cast.text.includes('⌐◨-◨'), [cast])

  const [signerLoaded, setSignerLoaded] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(cast.reactions.likes.length)

  // Check if the cast is liked after the signer is loaded
  useEffect(() => {
    if (isLoading || signerLoaded || signer?.status !== 'approved') return

    setLiked(!!cast.reactions.likes.find((like) => like.fid === signer.fid))
    setSignerLoaded(true)
  }, [isLoading, signerLoaded, signer, cast.reactions.likes])

  const handleLike = useCallback(() => {
    if (!session?.id) {
      toast('TODO: show login QR code')
      return
    }

    if (signer?.status !== 'approved') {
      toast('TODO: show signer QR code')
      return
    }

    async function execute() {
      setLiked(true)
      setLikeCount((curr) => curr + 1)

      const response = await fetch(`/api/casts/${cast.hash}/like`, {
        method: 'POST',
      })

      if (!response.ok) {
        setLiked(false)
        setLikeCount((curr) => curr - 1)
        toast.error('Failed to like cast')
      }
    }

    void execute()
  }, [session?.id, signer?.status, cast.hash])

  const handleUnlike = useCallback(() => {
    async function execute() {
      setLiked(false)
      setLikeCount((curr) => curr - 1)

      const response = await fetch(`/api/casts/${cast.hash}/like`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        setLiked(true)
        setLikeCount((curr) => curr + 1)
        toast('Failed to unlike cast')
      }
    }

    void execute()
  }, [cast])

  return (
    <span {...props}>
      <button
        onClick={liked ? handleUnlike : handleLike}
        className={styles.button}
        data-liked={liked}
      >
        {hasNoggles ? (
          '⌐◨-◨'
        ) : (
          <HeartIcon size={16} className={styles.icon} data-liked={liked} />
        )}
      </button>
      {likeCount}
    </span>
  )
}
