import { useModal, useSIWE } from 'connectkit'
import { RepeatIcon } from 'lucide-react'
import type { Cast } from 'neynar-next/server'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { useSigner } from '@/lib/neynar/client'
import styles from './recast-button.module.css'

type RecastButtonProps = HTMLAttributes<HTMLSpanElement> & {
  cast: Cast
}

export default function RecastButton({ cast, ...props }: RecastButtonProps) {
  const { address } = useAccount()
  const { setOpen, openSIWE } = useModal()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { isSignedIn } = useSIWE()
  const { signer, isLoading } = useSigner()

  const [signerLoaded, setSignerLoaded] = useState(false)
  const [recasted, setRecasted] = useState(false)
  const [recastCount, setRecastCount] = useState(cast.reactions.recasts.length)

  // Check if the cast is recasted after the signer is loaded
  useEffect(() => {
    if (isLoading || signerLoaded || signer?.status !== 'approved') return

    setRecasted(
      !!cast.reactions.recasts.find((recast) => recast.fid === signer.fid),
    )
    setSignerLoaded(true)
  }, [isLoading, signerLoaded, signer, cast.reactions.recasts])

  const handleRecast = useCallback(() => {
    if (signer?.status !== 'approved') {
      if (!address) setOpen(true)
      else if (!isSignedIn) openSIWE()
      return
    }

    async function execute() {
      try {
        setRecasted(true)
        setRecastCount((curr) => curr + 1)
        await fetch(`/api/casts/${cast.hash}/recast`, { method: 'POST' })
      } catch (e) {
        setRecasted(false)
        setRecastCount((curr) => curr - 1)
        toast.error('Failed to recast cast')
      }
    }

    void execute()
  }, [address, cast.hash, isSignedIn, openSIWE, setOpen, signer?.status])

  const handleUnrecast = useCallback(() => {
    async function execute() {
      try {
        setRecasted(false)
        setRecastCount((curr) => curr - 1)
        await fetch(`/api/casts/${cast.hash}/recast`, { method: 'DELETE' })
      } catch (e) {
        setRecasted(true)
        setRecastCount((curr) => curr + 1)
        toast('Failed to unrecast cast')
      }
    }

    void execute()
  }, [cast])

  return (
    <span {...props}>
      <button onClick={recasted ? handleUnrecast : handleRecast}>
        <RepeatIcon
          size={16}
          className={styles.icon}
          data-recasted={recasted}
        />
      </button>
      {recastCount}
    </span>
  )
}
