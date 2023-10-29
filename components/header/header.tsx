'use client'

import { ConnectKitButton } from 'connectkit'
import Link from 'next/link'
import styles from './header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/">
        <h1>nouns.zone</h1>
      </Link>
      <ConnectKitButton />
    </header>
  )
}
