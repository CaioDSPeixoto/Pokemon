import Image from 'next/image'
import Link from 'next/link'

import { useCollection } from '../contexts/CollectionContext'
import styles from '../styles/Card.module.css'

export default function Card({ pokemon }) {
  const { getStatus, toggle } = useCollection()
  const status = getStatus(pokemon.id)

  return (
    <div className={styles.card}>
      <Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
        height="120"
        width="120"
        alt=""
      />
      <p className={styles.id}>#{pokemon.id}</p>
      <h3 className={styles.title}>{pokemon.name}</h3>
      <Link href={`/pokemon/${pokemon.id}`}>
        <a className={styles.btn}>Detalhes</a>
      </Link>
      <div className={styles.collection_btns}>
        <button
          className={`${styles.col_btn} ${status === 'tenho' ? styles.col_active_tenho : ''}`}
          onClick={() => toggle(pokemon.id, pokemon.name, 'tenho')}
        >
          Tenho
        </button>
        <button
          className={`${styles.col_btn} ${status === 'quero' ? styles.col_active_quero : ''}`}
          onClick={() => toggle(pokemon.id, pokemon.name, 'quero')}
        >
          Quero
        </button>
      </div>
    </div>
  )
}
