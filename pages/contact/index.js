import Head from 'next/head'
import styles from '../../styles/Contact.module.css'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contato | Pokemon</title>
      </Head>
      <div className={styles.contact}>
        <h1>Contato</h1>
        <p>Tem alguma dúvida ou sugestão? Preencha o formulário abaixo.</p>
        <form className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Nome</label>
            <input id="name" type="text" placeholder="Seu nome" />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <div className={styles.field}>
            <label htmlFor="message">Mensagem</label>
            <textarea id="message" rows="5" placeholder="Sua mensagem..." />
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </>
  )
}
