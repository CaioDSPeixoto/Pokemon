import Image from 'next/image'
import styles from '../../styles/About.module.css'

export default function About() {
  return (
    <>
      <div className={styles.about}>
        <h1>Sobre o projeto</h1>
        <Image src="/images/pokemons.png" width="200" height="200" alt="Pokémon" />
        <p>
          Este é um projeto de estudo desenvolvido com <strong>Next.js</strong>,
          utilizando a <strong>PokéAPI</strong> para exibir informações sobre os Pokémon.
        </p>
        <p>
          Foram explorados conceitos como roteamento dinâmico, geração estática
          de páginas (SSG) com <code>getStaticProps</code> e <code>getStaticPaths</code>,
          renderização no servidor (SSR) com <code>getServerSideProps</code>,
          e consumo de APIs externas.
        </p>
        <p>
          A aplicação permite listar todos os Pokémon com paginação, buscar por nome
          e filtrar por tipo, além de visualizar detalhes como tipos, altura, peso,
          habilidades e stats base de cada um.
        </p>
      </div>
    </>
  )
}
