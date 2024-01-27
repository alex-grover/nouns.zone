import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOutIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback } from 'react'
import SignInButton from '@/components/sign-in-button'
import useSession from '@/lib/session'
import { useSigner } from '@/lib/signer'
import styles from './header-menu.module.css'

export default function HeaderMenu() {
  const { session, signOut } = useSession()
  const { clearSigner } = useSigner()

  const handleSignOut = useCallback(() => {
    async function execute() {
      await signOut()
      void clearSigner()
      // TODO: clear SWR cache?
    }

    void execute()
  }, [signOut, clearSigner])

  if (session?.id) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className={styles.button}>
          <Image
            src={session.pfpUrl}
            alt="Profile picture"
            height="24"
            width="24"
            className={styles.avatar}
          />
          @{session.username}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className={styles.menu}>
          <DropdownMenu.Item asChild>
            <Link href={`/users/${session.username}`} className={styles.item}>
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

  return <SignInButton />
}
