'use client'

import { ConnectKitButton } from 'connectkit'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback } from 'react'
import { useNav } from '@/components/nav'
import Noggles from '@/components/noggles'
import styles from './header.module.css'

export default function Header() {
  const { setOpen } = useNav()

  const handleMenuClicked = useCallback(() => {
    setOpen(true)
  }, [setOpen])

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.link}>
        <Noggles className={styles.logo} />
        <h1 className={styles.brand}>nouns.zone</h1>
      </Link>
      <div className={styles.button}>
        <ConnectKitButton mode="light" />
      </div>
      <button onClick={handleMenuClicked} className={styles.menu}>
        <MenuIcon />
      </button>
    </header>
  )
}
