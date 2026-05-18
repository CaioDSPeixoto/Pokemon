import { createContext, useContext, useState, useEffect } from 'react'

const CollectionContext = createContext()

export function CollectionProvider({ children }) {
  const [collection, setCollection] = useState({ tenho: {}, quero: {} })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pokemon_collection')
      if (saved) setCollection(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  function toggle(id, name, status) {
    setCollection(prev => {
      const next = { tenho: { ...prev.tenho }, quero: { ...prev.quero } }
      const other = status === 'tenho' ? 'quero' : 'tenho'

      if (next[status][id]) {
        delete next[status][id]
      } else {
        next[status][id] = name
        delete next[other][id]
      }

      try {
        localStorage.setItem('pokemon_collection', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  function getStatus(id) {
    if (collection.tenho[id]) return 'tenho'
    if (collection.quero[id]) return 'quero'
    return null
  }

  return (
    <CollectionContext.Provider value={{ collection, toggle, getStatus, loaded }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  return useContext(CollectionContext)
}
