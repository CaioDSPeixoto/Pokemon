import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useCollection } from '../contexts/CollectionContext'
import styles from '../styles/Colecao.module.css'

export default function Colecao() {
  const { collection, toggle, loaded } = useCollection()
  const [tab, setTab] = useState('tenho')

  const tenhoList = Object.entries(collection.tenho)
  const queroList = Object.entries(collection.quero)
  const current = tab === 'tenho' ? tenhoList : queroList

  return (
    <>
      <div className={styles.header}>
        <h1>Minha Coleção</h1>
        <p className={styles.subtitle}>
          {tenhoList.length} carta{tenhoList.length !== 1 ? 's' : ''} na coleção
          {' · '}
          {queroList.length} na lista de desejos
        </p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'tenho' ? styles.tab_active : ''}`}
          onClick={() => setTab('tenho')}
        >
          Tenho ({tenhoList.length})
        </button>
        <button
          className={`${styles.tab} ${tab === 'quero' ? styles.tab_active : ''}`}
          onClick={() => setTab('quero')}
        >
          Quero ({queroList.length})
        </button>
      </div>

      {!loaded ? (
        <p className={styles.empty}>Carregando...</p>
      ) : current.length === 0 ? (
        <div className={styles.empty}>
          <p>
            {tab === 'tenho'
              ? 'Nenhuma carta marcada como "Tenho" ainda.'
              : 'Nenhuma carta na lista de desejos ainda.'}
          </p>
          <Link href="/"><a className={styles.link_home}>Explorar Pokémon</a></Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {current.map(([id, name]) => (
            <div key={id} className={styles.item}>
              <Link href={`/pokemon/${id}`}>
                <a className={styles.item_link}>
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    width={80}
                    height={80}
                    alt={name}
                  />
                  <p className={styles.item_name}>{name}</p>
                  <p className={styles.item_id}>#{id}</p>
                </a>
              </Link>
              <button
                className={styles.remove_btn}
                onClick={() => toggle(parseInt(id), name, tab)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
