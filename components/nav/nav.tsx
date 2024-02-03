'use client'

import {
  ExternalLinkIcon,
  GithubIcon,
  HelpCircleIcon,
  KeyIcon,
  LogOutIcon,
  TextIcon,
  XIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import Button from '@/components/button'
import { useNav } from '@/components/nav/nav-provider'
import SignInButton from '@/components/sign-in-button'
import { useSignerDialog } from '@/components/signer-dialog'
import useSession from '@/lib/session'
import { useSigner } from '@/lib/signer'
import styles from './nav.module.css'

export default function Nav() {
  const pathname = usePathname()
  const { open, setOpen } = useNav()
  const { session, signOut } = useSession()
  const { signer, isLoading, clearSigner } = useSigner()
  const { setOpen: setSignerDialogOpen } = useSignerDialog()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleAddSigner = useCallback(() => {
    setSignerDialogOpen(true)
  }, [setSignerDialogOpen])

  const handleSignOut = useCallback(() => {
    async function execute() {
      await signOut()
      void clearSigner()
      // TODO: clear SWR cache?
    }

    void execute()
  }, [signOut, clearSigner])

  return (
    <nav className={styles.nav} data-open={open}>
      <div>
        <div className={styles.header}>
          {session?.id ? (
            <Link
              href={`/users/${session.username}`}
              onClick={handleClose}
              className={styles.user}
            >
              <Image
                src={session.pfpUrl}
                alt="Profile picture"
                height="32"
                width="32"
                className={styles.avatar}
              />
              @{session.username}
            </Link>
          ) : (
            <div />
          )}
          <button onClick={handleClose} className={styles.close}>
            <XIcon />
          </button>
        </div>
        <ol className={styles.list}>
          <li>
            <Link
              href="/"
              onClick={handleClose}
              className={styles.link}
              data-selected={pathname === '/'}
            >
              <TextIcon />
              <span>Discussion</span>
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              onClick={handleClose}
              className={styles.link}
              data-selected={pathname === '/about'}
            >
              <HelpCircleIcon />
              <span>About</span>
            </Link>
          </li>
          <li>
            <a href="https://nouns.wtf" target="_blank" className={styles.link}>
              <ExternalLinkIcon />
              <span>nouns.wtf</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/alex-grover/nouns.zone"
              target="_blank"
              className={styles.link}
            >
              <GithubIcon />
              <span>GitHub</span>
            </a>
          </li>
        </ol>
      </div>
      <div className={styles.buttons}>
        {!session?.id ? (
          <SignInButton />
        ) : (
          <>
            {!isLoading && signer?.status !== 'approved' && (
              <Button onClick={handleAddSigner}>
                <KeyIcon />
                <span>Add signer</span>
              </Button>
            )}
            <Button onClick={handleSignOut}>
              <LogOutIcon />
              <span>Sign out</span>
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
