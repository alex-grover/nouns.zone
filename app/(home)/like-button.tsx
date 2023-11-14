import { useModal, useSIWE } from 'connectkit'
import { HeartIcon } from 'lucide-react'
import type { Cast } from 'neynar-next/server'
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { useSigner } from '@/lib/neynar/client'
import styles from './like-button.module.css'

type LikeButtonProps = HTMLAttributes<HTMLSpanElement> & {
  cast: Cast
}

export default function LikeButton({ cast, ...props }: LikeButtonProps) {
  const { address } = useAccount()
  const { setOpen, openSIWE } = useModal()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { isSignedIn } = useSIWE()
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
    if (signer?.status !== 'approved') {
      if (!address) setOpen(true)
      else if (!isSignedIn) openSIWE()
      return
    }

    async function execute() {
      try {
        setLiked(true)
        setLikeCount((curr) => curr + 1)
        await fetch(`/api/casts/${cast.hash}/like`, { method: 'POST' })
      } catch (e) {
        setLiked(false)
        setLikeCount((curr) => curr - 1)
        toast.error('Failed to like cast')
      }
    }

    void execute()
  }, [address, cast.hash, isSignedIn, openSIWE, setOpen, signer?.status])

  const handleUnlike = useCallback(() => {
    async function execute() {
      try {
        setLiked(false)
        setLikeCount((curr) => curr - 1)
        await fetch(`/api/casts/${cast.hash}/like`, { method: 'DELETE' })
      } catch (e) {
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
