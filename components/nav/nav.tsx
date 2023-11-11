'use client'

import { useModal, useSIWE } from 'connectkit'
import { ExternalLinkIcon, HelpCircleIcon, TextIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User } from 'neynar-next/server'
import { useCallback } from 'react'
import useSWRImmutable from 'swr/immutable'
import Button from '@/components/button'
import { useNav } from '@/components/nav/nav-provider'
import { useSigner } from '@/lib/neynar/client'
import styles from './nav.module.css'

export default function Nav() {
  const pathname = usePathname()
  const { open, setOpen } = useNav()
  const { openSIWE } = useModal()
  const { signer, clearSigner } = useSigner()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { signOut } = useSIWE()

  const { data } = useSWRImmutable<User>(
    signer?.status === 'approved' ? `/api/users/${signer.fid}` : null,
  )

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

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

  return (
    <nav className={styles.nav} data-open={open}>
      <div>
        <div className={styles.header}>
          {data ? (
            <Link href={`/users/${data.username}`} className={styles.user}>
              <Image
                src={data.pfp_url}
                alt="Profile picture"
                height="32"
                width="32"
                className={styles.avatar}
              />
              @{data.username}
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
              <span>Nouns DAO</span>
            </a>
          </li>
        </ol>
      </div>
      <div className={styles.buttons}>
        {/* TODO: style like a menu */}
        {signer?.status !== 'approved' ? (
          <Button onClick={handleSignIn}>Sign in</Button>
        ) : (
          <Button onClick={handleSignOut}>Sign out</Button>
        )}
      </div>
    </nav>
  )
}
