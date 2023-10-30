import { ActivityIcon, HelpCircleIcon, TextIcon } from 'lucide-react'
import Link from 'next/link'
import styles from './nav.module.css'

// TODO: background + bold for current route, hover
export default function Nav() {
  return (
    <nav className={styles.nav}>
      <ol className={styles.list}>
        <li>
          <Link href="/" className={styles.link}>
            <TextIcon />
            <span>Discussion</span>
          </Link>
        </li>
        <li>
          <Link href="/activity" className={styles.link}>
            <ActivityIcon />
            <span>Activity</span>
          </Link>
        </li>
        <li>
          <Link href="/about" className={styles.link}>
            <HelpCircleIcon />
            <span>About</span>
          </Link>
        </li>
      </ol>
    </nav>
  )
}
