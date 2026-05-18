import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Card from '../components/Card'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

const TYPE_PT = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', grass: 'Planta',
  electric: 'Elétrico', ice: 'Gelo', fighting: 'Luta', poison: 'Veneno',
  ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
  rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
  steel: 'Aço', fairy: 'Fada'
}

const LIMIT = 20

export async function getServerSideProps({ query }) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const type = query.type || ''
  const search = query.search || ''
  const offset = (page - 1) * LIMIT

  let pokemons = []
  let totalPages = 1

  try {
    if (type) {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
      const data = await res.json()
      const all = data.pokemon
        .map(p => ({
          name: p.pokemon.name,
          id: parseInt(p.pokemon.url.split('/').filter(Boolean).pop())
        }))
        .filter(p => p.id < 10000)
        .sort((a, b) => a.id - b.id)

      totalPages = Math.ceil(all.length / LIMIT)
      pokemons = all.slice(offset, offset + LIMIT)
    } else if (search) {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0`)
      const data = await res.json()
      const filtered = data.results
        .map(p => ({
          name: p.name,
          id: parseInt(p.url.split('/').filter(Boolean).pop())
        }))
        .filter(p => p.id < 10000 && p.name.includes(search.toLowerCase()))

      totalPages = Math.ceil(filtered.length / LIMIT)
      pokemons = filtered.slice(offset, offset + LIMIT)
    } else {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`)
      const data = await res.json()
      totalPages = Math.ceil(data.count / LIMIT)
      pokemons = data.results.map(p => ({
        name: p.name,
        id: parseInt(p.url.split('/').filter(Boolean).pop())
      }))
    }
  } catch {
    pokemons = []
  }

  return {
    props: { pokemons, totalPages, currentPage: page, activeType: type, activeSearch: search }
  }
}

export default function Home({ pokemons, totalPages, currentPage, activeType, activeSearch }) {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState(activeSearch)

  useEffect(() => {
    setSearchInput(activeSearch)
  }, [activeSearch])

  function handleSearch(e) {
    e.preventDefault()
    if (!searchInput.trim()) return
    router.push({ pathname: '/', query: { search: searchInput.trim(), page: 1 } })
  }

  function handleTypeClick(t) {
    if (t === activeType) {
      router.push('/')
    } else {
      setSearchInput('')
      router.push({ pathname: '/', query: { type: t, page: 1 } })
    }
  }

  function handleClear() {
    setSearchInput('')
    router.push('/')
  }

  function changePage(newPage) {
    const q = { page: newPage }
    if (activeType) q.type = activeType
    if (activeSearch) q.search = activeSearch
    router.push({ pathname: '/', query: q })
  }

  return (
    <>
      <div className={styles.title_container}>
        <h1 className={styles.title}>Poke<span>mon</span></h1>
        <Image src="/images/pokeball.png" width="50" height="50" alt="Pokemon" />
      </div>

      <div className={styles.filters}>
        <form onSubmit={handleSearch} className={styles.search_form}>
          <input
            className={styles.search_input}
            type="text"
            placeholder="Buscar por nome..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className={styles.search_btn}>Buscar</button>
          {(activeType || activeSearch) && (
            <button type="button" className={styles.clear_btn} onClick={handleClear}>
              Limpar
            </button>
          )}
        </form>

        <div className={styles.types_filter}>
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => handleTypeClick(t)}
              className={`${styles.type_btn} ${styles[`type_btn_${t}`]} ${activeType === t ? styles.active : ''}`}
            >
              {TYPE_PT[t]}
            </button>
          ))}
        </div>
      </div>

      {pokemons.length === 0 ? (
        <p className={styles.empty}>Nenhum Pokémon encontrado.</p>
      ) : (
        <div className={styles.pokemon_container}>
          {pokemons.map(pokemon => (
            <Card key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.page_btn}
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </button>
          <span className={styles.page_info}>Página {currentPage} de {totalPages}</span>
          <button
            className={styles.page_btn}
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </>
  )
}
