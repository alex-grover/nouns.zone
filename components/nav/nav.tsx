'use client'

import { ConnectKitButton } from 'connectkit'
import { ExternalLinkIcon, HelpCircleIcon, TextIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useNav } from '@/components/nav/nav-provider'
import styles from './nav.module.css'

export default function Nav() {
  const pathname = usePathname()
  const { open, setOpen } = useNav()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <nav className={styles.nav} data-open={open}>
      <button onClick={handleClose} className={styles.close}>
        <XIcon size={16} />
      </button>
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
          <a href="https://nouns.wtf" className={styles.link}>
            <ExternalLinkIcon />
            <span>Nouns DAO</span>
          </a>
        </li>
      </ol>
      <div className={styles.button}>
        <ConnectKitButton mode="light" />
      </div>
    </nav>
  )
}
