import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ConnectKitButton, useModal } from 'connectkit'
import { LogOutIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { User } from 'neynar-next/server'
import { useCallback } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useDisconnect } from 'wagmi'
import Button from '@/components/button'
import { useSigner } from '@/lib/neynar/client'
import styles from './connect-button.module.css'

export default function ConnectButton() {
  const { openSIWE } = useModal()
  const { signer, clearSigner } = useSigner()
  const { disconnect } = useDisconnect()

  const { data } = useSWRImmutable<User>(
    signer?.status === 'approved' ? `/api/users/${signer.fid}` : null,
  )

  const handleSignIn = useCallback(() => {
    openSIWE(true)
  }, [openSIWE])

  const handleSignOut = useCallback(() => {
    disconnect()
    clearSigner()
    // TODO: clear SWR cache?
  }, [disconnect, clearSigner])

  if (signer?.status === 'approved' && data) {
    // TODO: not a dropdown on mobile
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={styles.button}>
          <Image
            src={data.pfp_url}
            alt="Profile picture"
            height="24"
            width="24"
            className={styles.avatar}
          />
          @{data.username}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.menu}>
          {/* TODO: icons, functionality */}
          <DropdownMenu.Item asChild>
            <Link href={`/users/${data.username}`} className={styles.item}>
              <UserIcon />
              <span>Profile</span>
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <button onClick={handleSignOut} className={styles.item}>
              <LogOutIcon />
              <span>Sign Out</span>
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className={styles.arrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  }

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show }) => (
        <Button onClick={isConnected ? handleSignIn : show}>Sign In</Button>
      )}
    </ConnectKitButton.Custom>
  )
}
