'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useSIWE } from 'connectkit'
import { XIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useSigner } from '@/lib/neynar/client'
import styles from './qr-code-dialog.module.css'

export default function QRCodeDialog() {
  const { signer, signIn } = useSigner()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { isSignedIn, signOut } = useSIWE()
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!isSignedIn || signer) return
    setOpen(true)
    void signIn()
  }, [isSignedIn, signer, signIn])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (!open) signOut()
    },
    [signOut],
  )

  if (signer?.status !== 'pending_approval') return null

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
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
