'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { useEffect } from 'react'
import QRCode from 'react-qr-code'
import { useSignerDialog } from '@/components/signer-dialog'
import useSession from '@/lib/session'
import { useSigner } from '@/lib/signer'
import styles from './signer-dialog.module.css'

export default function SignerDialog() {
  const { session } = useSession()
  const { signer, isLoading, createSigner } = useSigner()
  const { open, setOpen } = useSignerDialog()

  useEffect(() => {
    if (!session?.id || isLoading || signer) return
    setOpen(true)
    void createSigner()
  }, [session?.id, isLoading, signer, setOpen, createSigner])

  if (signer?.status !== 'pending_approval' || !signer.signer_approval_url)
    return null

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content}>
        <Dialog.Close className={styles.close}>
          <XIcon />
        </Dialog.Close>
        <Dialog.Title className={styles.title}>Sign In</Dialog.Title>
        <Dialog.Description className={styles.description}>
          On your mobile device with Warpcast, open the Camera app and scan the
          QR code.
        </Dialog.Description>
        <QRCode value={signer.signer_approval_url} className={styles.qr} />
        <a href={signer.signer_approval_url} target="_blank">
          Click for link
        </a>
      </Dialog.Content>
    </Dialog.Root>
  )
}
