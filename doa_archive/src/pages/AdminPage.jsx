import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AppShell } from '../components/layout/AppShell'
import { PageHeader } from '../components/layout/PageHeader'
import { useEntries } from '../hooks/useEntries'

export function AdminPage() {
  const navigate = useNavigate()
  const { entries, loading, error, refresh } = useEntries()

  return (
    <AppShell>
      <PageHeader
        eyebrow="ADMIN TERMINAL"
        title="ENTRY MANAGEMENT"
        subtitle="AUTHORIZED PERSONNEL ONLY"
      />

      <div className="flex justify-end mb-md">
        <button
          onClick={() => navigate('/admin/entry/new')}
          className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-md py-sm flex items-center gap-xs hover:bg-primary-fixed-dim transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          ADD ENTRY
        </button>
      </div>

      {error && (
        <p className="text-status-strip font-status-strip text-error uppercase mb-md">
          ERROR: {error}
        </p>
      )}

      {loading ? (
        <p className="text-status-strip font-status-strip text-on-surface-variant uppercase">
          LOADING ENTRIES...
        </p>
      ) : (
      <section className="flex flex-col gap-sm">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="bg-surface-container-low border border-outline-variant/30 p-sm flex items-center justify-between gap-md"
          >
            <div className="flex flex-col gap-xs flex-1 min-w-0">
              <span className="text-label-caps font-label-caps text-on-surface-variant uppercase text-[10px]">
                {entry.entry_type} · {entry.classification}
                {entry.is_gated && ' · GATED'}
              </span>
              <span className="text-body-md font-body-md text-on-surface truncate">{entry.title}</span>
              <span className="text-status-strip font-status-strip text-on-surface-variant">
                {entry.file_no} · {entry.updated_at}
              </span>
            </div>
            <div className="flex items-center gap-xs flex-shrink-0">
              <button
                onClick={() => navigate(`/admin/entry/${entry.id}/edit`)}
                className="border border-outline-variant/50 text-on-surface-variant font-label-caps text-label-caps px-sm py-xs hover:bg-surface-bright transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                EDIT
              </button>
              <button
                onClick={async () => {
                  if (!confirm(`Delete "${entry.title}"?`)) return
                  await supabase.from('entries').delete().eq('id', entry.id)
                  refresh()
                }}
                className="border border-error/30 text-error font-label-caps text-label-caps px-sm py-xs hover:bg-error/10 transition-colors flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                DELETE
              </button>
            </div>
          </div>
        ))}
      </section>
      )}
    </AppShell>
  )
}
