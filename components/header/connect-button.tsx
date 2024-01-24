import { type User } from '@neynar/nodejs-sdk/build/neynar-api/v1'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ConnectKitButton, useModal, useSIWE } from 'connectkit'
import { LogOutIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
import useSWRImmutable from 'swr/immutable'
import Button from '@/components/button'
import { useSigner } from '@/lib/neynar/client'
import styles from './connect-button.module.css'

export default function ConnectButton() {
  const { openSIWE } = useModal()
  const { signer, clearSigner } = useSigner()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { signOut } = useSIWE()

  const { data: user } = useSWRImmutable<User>(
    signer?.status === 'approved' ? `/api/users/${signer.fid}` : null,
  )

  const handleSignIn = useCallback(() => {
    openSIWE()
  }, [openSIWE])

  const handleSignOut = useCallback(() => {
    async function execute() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await signOut()
      clearSigner()
      // TODO: clear SWR cache?
    }

    void execute()
  }, [signOut, clearSigner])

  if (signer?.status === 'approved' && user) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={styles.button}>
          <Image
            src={user.pfp.url}
            alt="Profile picture"
            height="24"
            width="24"
            className={styles.avatar}
          />
          @{user.username}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.menu}>
          <DropdownMenu.Item asChild>
            <Link href={`/users/${user.username}`} className={styles.item}>
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
