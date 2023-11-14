import Link from 'next/link'
import styles from './page.module.css'

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1>Farcaster x Nouns</h1>
      <div>
        Decentralized social meets Nouns. nouns.zone is a Farcaster client for
        the Nouns channel.
      </div>
      <div>
        Maintained by{' '}
        <Link href={`/users/alexgrover.eth`} className={styles.link}>
          alexgrover.eth
        </Link>
      </div>
      <div>
        This project was funded by the{' '}
        <a
          href="https://prop.house/nouns/garden-round-1"
          target="_blank"
          className={styles.link}
        >
          Nouns Prop House Garden round 1
        </a>
        .
      </div>
      <div>
        You can find a project roadmap, request features and report bugs on the{' '}
        <a
          href="https://github.com/alex-grover/nouns.zone"
          target="_blank"
          className={styles.link}
        >
          project Github
        </a>
        .
      </div>
    </div>
  )
}
