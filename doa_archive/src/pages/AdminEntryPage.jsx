import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { EntryEditor } from '../components/admin/EntryEditor'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { supabase } from '../lib/supabase'

export function AdminEntryPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(isEditing)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEditing) return
    supabase
      .from('entries')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setEntry(data)
        setLoading(false)
      })
  }, [id, isEditing])

  return (
    <AppShell>
      <PageHeader
        eyebrow="ADMIN TERMINAL"
        title={isEditing ? 'EDIT ENTRY' : 'NEW ENTRY'}
        subtitle="AUTHORIZED PERSONNEL ONLY"
      />
      {loading ? (
        <SkeletonCard />
      ) : error ? (
        <p className="text-status-strip font-status-strip text-error uppercase">{error}</p>
      ) : (
        <EntryEditor entry={isEditing ? entry : null} />
      )}
    </AppShell>
  )
}
