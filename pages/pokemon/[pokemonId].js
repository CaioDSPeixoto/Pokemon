import Image from 'next/image'
import Link from 'next/link'

import { useCollection } from '../../contexts/CollectionContext'
import styles from '../../styles/Pokemon.module.css'

function extractChain(chain) {
  const stages = []
  function traverse(node, depth) {
    if (!stages[depth]) stages[depth] = []
    const id = parseInt(node.species.url.split('/').filter(Boolean).pop())
    stages[depth].push({ name: node.species.name, id })
    node.evolves_to.forEach(next => traverse(next, depth + 1))
  }
  traverse(chain, 0)
  return stages
}

export const getStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps = async (context) => {
  const id = context.params.pokemonId

  const res = await fetch(`${process.env.NEXT_URL_POKEMON}${id}`)

  if (!res.ok) {
    return { notFound: true }
  }

  const data = await res.json()

  let evolutionChain = []
  try {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    if (speciesRes.ok) {
      const species = await speciesRes.json()
      const chainRes = await fetch(species.evolution_chain.url)
      if (chainRes.ok) {
        const chainData = await chainRes.json()
        evolutionChain = extractChain(chainData.chain)
      }
    }
  } catch (e) {
    evolutionChain = []
  }

  return {
    props: {
      pokemon: data,
      urlImagem: `${process.env.NEXT_URL_IMAGE_POKEMON}${id}.png`,
      evolutionChain
    }
  }
}

export default function Pokemon({ pokemon, urlImagem, evolutionChain }) {
  const { getStatus, toggle } = useCollection()
  const status = getStatus(pokemon.id)

  const ligaUrl = `https://www.ligapokemon.com.br/?view=pokedex/pokemon&id=${pokemon.id}`

  return (
    <>
      <div className={styles.back_row}>
        <Link href="/"><a className={styles.back_btn}>← Voltar</a></Link>
      </div>

      <div className={styles.pokemon_container}>
        <h1 className={styles.title}>{pokemon.name}</h1>
        <Image src={urlImagem} height="200" width="200" alt={pokemon.name} />

        <div className={styles.collection_btns}>
          <button
            className={`${styles.col_btn} ${status === 'tenho' ? styles.col_active_tenho : ''}`}
            onClick={() => toggle(pokemon.id, pokemon.name, 'tenho')}
          >
            {status === 'tenho' ? 'Tenho (remover)' : 'Tenho'}
          </button>
          <button
            className={`${styles.col_btn} ${status === 'quero' ? styles.col_active_quero : ''}`}
            onClick={() => toggle(pokemon.id, pokemon.name, 'quero')}
          >
            {status === 'quero' ? 'Quero (remover)' : 'Quero'}
          </button>
        </div>

        <a
          href={ligaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.liga_btn}
        >
          Ver preco na Liga Pokemon
        </a>

        <div>
          <h3>Número:</h3>
          <p>#{pokemon.id}</p>
        </div>

        <div>
          <h3>Tipos:</h3>
          <div className={styles.types_container}>
            {pokemon.types.map((item, index) => (
              <span
                key={index}
                className={`${styles.type} ${styles['type_' + item.type.name]}`}
              >
                {item.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.data_container}>
          <div className={styles.data_height}>
            <h4>Altura:</h4>
            <p>{pokemon.height * 10} cm</p>
          </div>
          <div className={styles.data_weight}>
            <h4>Peso:</h4>
            <p>{pokemon.weight / 10} kg</p>
          </div>
        </div>

        <div className={styles.abilities_section}>
          <h3>Habilidades:</h3>
          <div className={styles.abilities_container}>
            {pokemon.abilities.map((item, index) => (
              <span
                key={index}
                className={`${styles.ability} ${item.is_hidden ? styles.ability_hidden : ''}`}
              >
                {item.ability.name}
                {item.is_hidden && <small> (oculta)</small>}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.stats_section}>
          <h3>Stats Base:</h3>
          {pokemon.stats.map((item, index) => (
            <div key={index} className={styles.stat_row}>
              <span className={styles.stat_name}>{item.stat.name}</span>
              <div className={styles.stat_bar_bg}>
                <div
                  className={styles.stat_bar}
                  style={{ width: `${Math.min(100, (item.base_stat / 255) * 100)}%` }}
                />
              </div>
              <span className={styles.stat_value}>{item.base_stat}</span>
            </div>
          ))}
        </div>

        {evolutionChain.length > 1 && (
          <div className={styles.evolution_section}>
            <h3>Evolução:</h3>
            <div className={styles.evolution_chain}>
              {evolutionChain.map((stage, stageIndex) => (
                <div key={stageIndex} className={styles.evolution_stage_wrapper}>
                  {stageIndex > 0 && (
                    <span className={styles.evolution_arrow}>→</span>
                  )}
                  <div className={styles.evolution_stage}>
                    {stage.map(evo => (
                      <Link key={evo.id} href={`/pokemon/${evo.id}`}>
                        <a
                          className={`${styles.evolution_item} ${evo.id === pokemon.id ? styles.evolution_current : ''}`}
                        >
                          <Image
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                            width={48}
                            height={48}
                            alt={evo.name}
                          />
                          <span className={styles.evolution_name}>{evo.name}</span>
                        </a>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
