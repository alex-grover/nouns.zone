import { type ButtonHTMLAttributes, type DetailedHTMLProps } from 'react'
import styles from './button.module.css'

export default function Button(
  props: Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'className'
  >,
) {
  return <button className={styles.button} {...props} />
}
