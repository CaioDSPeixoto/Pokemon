import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useCollection } from '../contexts/CollectionContext'
import styles from '../styles/Colecao.module.css'

const GENERATIONS = [
  { label: 'Gen I',    min: 1,   max: 151  },
  { label: 'Gen II',   min: 152, max: 251  },
  { label: 'Gen III',  min: 252, max: 386  },
  { label: 'Gen IV',   min: 387, max: 493  },
  { label: 'Gen V',    min: 494, max: 649  },
  { label: 'Gen VI',   min: 650, max: 721  },
  { label: 'Gen VII',  min: 722, max: 809  },
  { label: 'Gen VIII', min: 810, max: 905  },
  { label: 'Gen IX',   min: 906, max: 1025 },
]

export default function Colecao() {
  const { collection, toggle, loaded } = useCollection()
  const [tab, setTab] = useState('tenho')

  const tenhoList = Object.entries(collection.tenho)
  const queroList = Object.entries(collection.quero)
  const current = tab === 'tenho' ? tenhoList : queroList

  const genStats = GENERATIONS.map(gen => {
    const total = gen.max - gen.min + 1
    const have = Object.keys(collection.tenho).filter(id => {
      const n = parseInt(id)
      return n >= gen.min && n <= gen.max
    }).length
    return { ...gen, total, have, pct: Math.round((have / total) * 100) }
  })

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

      {loaded && (
        <div className={styles.stats_section}>
          <h2>Progresso por Geração</h2>
          <p className={styles.summary}>{tenhoList.length} / 1025 Pokémon coletados</p>
          {genStats.map(gen => (
            <div key={gen.label} className={styles.gen_row}>
              <span className={styles.gen_label}>{gen.label}</span>
              <span className={styles.gen_count}>{gen.have}/{gen.total}</span>
              <div className={styles.gen_bar_bg}>
                <div className={styles.gen_bar} style={{ width: `${gen.pct}%` }} />
              </div>
              <span className={styles.gen_pct}>{gen.pct}%</span>
            </div>
          ))}
        </div>
      )}

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
