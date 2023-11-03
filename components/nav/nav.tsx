'use client'

import { ExternalLinkIcon, HelpCircleIcon, TextIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './nav.module.css'

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <ol className={styles.list}>
        <li>
          <Link
            href="/"
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
    </nav>
  )
}
