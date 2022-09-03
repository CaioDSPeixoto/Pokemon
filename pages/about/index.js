import Image from 'next/image'

import styles from '../../styles/About.module.css'

export default function About() {
  return (
    <>
      <div className={styles.about}>
        <h1>Sobre o projeto</h1>
        <Image src="/images/pokemons.png" width="200" height="200"></Image>
        <p>Texto aqui</p>
      </div>
    </>
  )
}
