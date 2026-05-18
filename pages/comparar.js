import { useState, useEffect } from 'react'
import Image from 'next/image'

import PokemonInput from '../components/PokemonInput'
import styles from '../styles/Comparar.module.css'

const STAT_NAMES = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']

function getStat(pokemon, statName) {
  const found = pokemon.stats.find(s => s.stat.name === statName)
  return found ? found.base_stat : 0
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function normalizeName(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '-')
}

export default function Comparar() {
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [pokemonA, setPokemonA] = useState(null)
  const [pokemonB, setPokemonB] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [allNames, setAllNames] = useState([])

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1302')
      .then(r => r.json())
      .then(data => setAllNames(data.results.map(p => p.name)))
      .catch(() => {})
  }, [])

  async function handleCompare(e) {
    e.preventDefault()
    setError('')
    setPokemonA(null)
    setPokemonB(null)
    setLoading(true)

    try {
      const [resA, resB] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${normalizeName(nameA)}`),
        fetch(`https://pokeapi.co/api/v2/pokemon/${normalizeName(nameB)}`)
      ])

      if (!resA.ok) { setError(`Pokémon "${nameA}" não encontrado.`); setLoading(false); return }
      if (!resB.ok) { setError(`Pokémon "${nameB}" não encontrado.`); setLoading(false); return }

      const [dataA, dataB] = await Promise.all([resA.json(), resB.json()])
      setPokemonA(dataA)
      setPokemonB(dataB)
    } catch {
      setError('Erro ao buscar Pokémon. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const totalA = pokemonA ? STAT_NAMES.reduce((sum, s) => sum + getStat(pokemonA, s), 0) : 0
  const totalB = pokemonB ? STAT_NAMES.reduce((sum, s) => sum + getStat(pokemonB, s), 0) : 0

  function cellClass(valA, valB, side) {
    if (valA === valB) return ''
    if (side === 'a') return valA > valB ? styles.winner : styles.loser
    return valB > valA ? styles.winner : styles.loser
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Comparar Pokémon</h1>

      <form className={styles.form} onSubmit={handleCompare}>
        <PokemonInput
          value={nameA}
          onChange={setNameA}
          placeholder="Nome do 1° Pokémon"
          names={allNames}
        />
        <PokemonInput
          value={nameB}
          onChange={setNameB}
          placeholder="Nome do 2° Pokémon"
          names={allNames}
        />
        <button className={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Comparar'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {pokemonA && pokemonB && (
        <div className={styles.comparison}>
          <div className={styles.header_row}>
            <div className={styles.pokemon_header}>
              <Image src={pokemonA.sprites.front_default} width={96} height={96} alt={pokemonA.name} />
              <span className={styles.pokemon_name}>{capitalize(pokemonA.name)}</span>
            </div>
            <div className={styles.stat_label_center}></div>
            <div className={styles.pokemon_header}>
              <Image src={pokemonB.sprites.front_default} width={96} height={96} alt={pokemonB.name} />
              <span className={styles.pokemon_name}>{capitalize(pokemonB.name)}</span>
            </div>
          </div>

          <div className={styles.stat_table}>
            {STAT_NAMES.map(statName => {
              const valA = getStat(pokemonA, statName)
              const valB = getStat(pokemonB, statName)
              return (
                <div key={statName} className={styles.stat_row}>
                  <span className={`${styles.val_a} ${cellClass(valA, valB, 'a')}`}>{valA}</span>
                  <span className={styles.stat_label}>{statName}</span>
                  <span className={`${styles.val_b} ${cellClass(valA, valB, 'b')}`}>{valB}</span>
                </div>
              )
            })}
            <div className={`${styles.stat_row} ${styles.total_row}`}>
              <span className={`${styles.val_a} ${cellClass(totalA, totalB, 'a')}`}>{totalA}</span>
              <span className={styles.stat_label}>Total</span>
              <span className={`${styles.val_b} ${cellClass(totalA, totalB, 'b')}`}>{totalB}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
