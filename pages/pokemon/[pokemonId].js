import Image from 'next/image'
import Link from 'next/link'

import styles from '../../styles/Pokemon.module.css'

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

  return {
    props: {
      pokemon: data,
      urlImagem: `${process.env.NEXT_URL_IMAGE_POKEMON}${id}.png`
    }
  }
}

export default function Pokemon({ pokemon, urlImagem }) {
  return (
    <>
      <div className={styles.pokemon_container}>
        <Link href="/"><a className={styles.back_btn}>← Voltar</a></Link>

        <h1 className={styles.title}>{pokemon.name}</h1>
        <Image src={urlImagem} height="200" width="200" alt={pokemon.name} />

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
      </div>
    </>
  )
}
