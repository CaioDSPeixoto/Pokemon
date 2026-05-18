import Navbar from "./Navbar"
import Footer from "./Footer"
import Head from 'next/head'

export default function Layout({ children }) {
    return (
      <>
        <Head>
            <link rel="shortcut icon" href="/images/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Pokemon</title>
        </Head>
        <Navbar />
            <main className="main-container"> {children} </main>
        <Footer />
      </>
    )
  }