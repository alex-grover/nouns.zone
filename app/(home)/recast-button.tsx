import { type CastWithInteractions } from '@neynar/nodejs-sdk/build/neynar-api/v2'
import { RepeatIcon } from 'lucide-react'
import { type HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSession from '@/lib/session'
import { useSigner } from '@/lib/signer'
import styles from './recast-button.module.css'

type RecastButtonProps = HTMLAttributes<HTMLSpanElement> & {
  cast: CastWithInteractions
}

export default function RecastButton({ cast, ...props }: RecastButtonProps) {
  const { session } = useSession()
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
    if (!session?.id) {
      toast('TODO: show login QR code')
      return
    }

    if (signer?.status !== 'approved') {
      toast('TODO: show signer QR code')
      return
    }

    async function execute() {
      setRecasted(true)
      setRecastCount((curr) => curr + 1)

      const response = await fetch(`/api/casts/${cast.hash}/recast`, {
        method: 'POST',
      })

      if (!response.ok) {
        setRecasted(false)
        setRecastCount((curr) => curr - 1)
        toast.error('Failed to recast cast')
      }
    }

    void execute()
  }, [session?.id, signer?.status, cast.hash])

  const handleUnrecast = useCallback(() => {
    async function execute() {
      setRecasted(false)
      setRecastCount((curr) => curr - 1)

      const response = await fetch(`/api/casts/${cast.hash}/recast`, {
        method: 'DELETE',
      })

      if (!response.ok) {
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
