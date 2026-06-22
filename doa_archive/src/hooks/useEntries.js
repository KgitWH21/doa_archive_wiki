import { useState, useEffect } from 'react'
import { mockEntries } from '../lib/mockData'

export function useEntries(searchQuery = '') {
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState([])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const filtered = searchQuery
        ? mockEntries.filter(
            (e) =>
              e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.public_content.toLowerCase().includes(searchQuery.toLowerCase()) ||
              e.entry_type.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : mockEntries
      setEntries(filtered.filter((e) => e.is_published))
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return { entries, loading }
}

export function useEntry(slug) {
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setEntry(mockEntries.find((e) => e.slug === slug) ?? null)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [slug])

  return { entry, loading }
}
