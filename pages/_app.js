import '../styles/globals.css'

import Layout from '../components/Layout'
import { CollectionProvider } from '../contexts/CollectionContext'

function MyApp({ Component, pageProps }) {
  return (
    <CollectionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CollectionProvider>
  )
}

export default MyApp
