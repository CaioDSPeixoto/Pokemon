import { useState, useEffect, useRef } from 'react'
import styles from '../styles/PokemonInput.module.css'

export default function PokemonInput({ value, onChange, placeholder, names }) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const q = value.toLowerCase().trim()
    if (q.length < 2 || !names.length) {
      setSuggestions([])
      setOpen(false)
      return
    }
    const filtered = names.filter(n => n.includes(q)).slice(0, 8)
    setSuggestions(filtered)
    setOpen(filtered.length > 0)
  }, [value, names])

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function select(name) {
    onChange(name)
    setOpen(false)
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <input
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && (
        <ul className={styles.dropdown}>
          {suggestions.map(name => (
            <li key={name} onMouseDown={() => select(name)} className={styles.item}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
