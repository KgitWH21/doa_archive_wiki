import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function normalizeEntry(row) {
  return { ...row, entry_type: row.type, public_content: row.summary }
}

export function useEntries(searchQuery = '') {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  function refresh() { setTick((t) => t + 1) }

  useEffect(() => {
    let cancelled = false

    async function fetchEntries() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('entries')
        .select('id, title, slug, type, classification, summary, is_gated, is_published, created_at, updated_at')
        .eq('is_published', true)

      if (searchQuery.trim()) {
        query = query.or(
          `title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,type.ilike.%${searchQuery}%`
        )
      }

      const { data, error: err } = await query
      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      setEntries((data ?? []).map(normalizeEntry))
      setLoading(false)
    }

    fetchEntries()
    return () => { cancelled = true }
  }, [searchQuery, tick])

  return { entries, loading, error, refresh }
}

export function useEntry(slug) {
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    async function fetchEntry() {
      setLoading(true)
      setError(null)

      const { data, error: err } = await supabase
        .from('entries')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single()

      if (cancelled) return
      if (err) {
        setError(err.message)
        setLoading(false)
        return
      }
      setEntry(data ? normalizeEntry(data) : null)
      setLoading(false)
    }

    fetchEntry()
    return () => { cancelled = true }
  }, [slug])

  return { entry, loading, error }
}
