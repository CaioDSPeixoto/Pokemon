import Link from 'next/link'
import Image from 'next/image'

import styles from '../styles/NotFound.module.css'

export default function NotFound() {
    return (
        <>
            <div className={styles.notfound}>
                <p className={styles.title}>Parece que esta página não existe!</p>
                <Image src="/images/notfound.png" height="200" width="200" alt="Não foi encontrado a página"></Image>
                <Link href="/"><a className={styles.btn}>Voltar</a></Link>
            </div>
        </>        
    )
}