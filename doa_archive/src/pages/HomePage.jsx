import { useState, useEffect } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { EntryCard } from '../components/ui/EntryCard'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { useEntries } from '../hooks/useEntries'
import { useAuth } from '../hooks/useAuth'

export function HomePage() {
  const [query, setQuery] = useState('')
  const { entries, loading } = useEntries(query)
  const { refreshProfile } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('payment') === 'success') {
      refreshProfile()
      window.history.replaceState({}, '', '/')
    }
  }, [])

  return (
    <AppShell>
      <PageHeader
        eyebrow="DEPARTMENT OF OTHERWORLDLY AFFAIRS"
        title="THE DOA ARCHIVE"
        subtitle="CEREUS & LIMNIC · TYPE B · PUBLIC ACCESS"
      />

      {/* Search bar */}
      <section className="mb-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH ARCHIVE..."
            className="w-full bg-[#0A1628] border border-primary-container focus:border-primary-fixed-dim focus:ring-1 focus:ring-primary-container text-on-surface font-label-caps text-label-caps py-sm pl-xl pr-md placeholder:text-outline outline-none transition-colors rounded-none"
          />
          <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-outline opacity-50 text-[14px]">
            keyboard_return
          </span>
        </div>
      </section>

      {/* Entry list */}
      <section className="flex flex-col gap-md">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : entries.length === 0 ? (
          <div className="bg-surface-container-low border border-outline-variant/30 p-md text-center">
            <p className="text-label-caps font-label-caps text-on-surface-variant">
              NO RECORDS MATCH QUERY — REFINE SEARCH PARAMETERS
            </p>
          </div>
        ) : (
          entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
        )}
      </section>
    </AppShell>
  )
}
