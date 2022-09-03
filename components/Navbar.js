import Link from 'next/link'
import Image from 'next/image'

import styles from '../styles/Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image src="/images/pokeball.png" width="30" height="30" alt="Pokeball" />
        <h1>Pokemon</h1>
      </div>
      <ul className={styles.link_itens}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">Sobre</Link>
        </li>
        <li>
          <Link href="/contact">Contato</Link>
        </li>
      </ul>
    </nav>
  )
}
