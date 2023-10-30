'use client'

import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import Noggles from '@/components/noggles'
import styles from './header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.link}>
        <Noggles className={styles.logo} />
        <h1>nouns.zone</h1>
      </Link>
      <ConnectKitButton />
    </header>
  )
}
