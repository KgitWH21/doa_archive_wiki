import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AppShell } from '../components/layout/AppShell'
import { GateBlock } from '../components/ui/GateBlock'
import { Badge } from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { useEntry } from '../hooks/useEntries'
import { useAuth } from '../hooks/useAuth'

export function EntryPage() {
  const { slug } = useParams()
  const { entry, loading } = useEntry(slug)
  const { isMember } = useAuth()

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col gap-lg mt-md">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </AppShell>
    )
  }

  if (!entry) {
    return (
      <AppShell>
        <div className="bg-surface-container border border-error/30 p-md mt-md text-center">
          <span
            className="material-symbols-outlined text-error text-4xl mb-sm block"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            error
          </span>
          <p className="text-headline-md font-headline-md text-error uppercase">FILE NOT FOUND</p>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs">
            No archive record matches this designation.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-xs mt-md text-label-caps font-label-caps text-primary hover:text-primary-fixed-dim"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            RETURN TO ARCHIVE
          </Link>
        </div>
      </AppShell>
    )
  }

  const isActive = entry.status?.toLowerCase().includes('active')

  return (
    <AppShell>
      <div className="flex flex-col gap-lg">
        {/* Back link */}
        <Link
          to="/"
          className="flex items-center gap-xs text-label-caps font-label-caps text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          ARCHIVE INDEX
        </Link>

        {/* Header */}
        <section className="bg-surface-container border-b border-primary-container p-md relative">
          <div className="absolute top-md right-md flex items-center gap-2">
            {isActive && (
              <span className="h-2 w-2 rounded-full bg-primary-container animate-pulse" />
            )}
            <span className="text-status-strip font-status-strip text-primary-container uppercase">
              {entry.status}
            </span>
          </div>

          <div className="text-label-caps font-label-caps text-secondary-fixed mb-xs">
            // {(entry.entry_type ?? 'document').toUpperCase()} FILE ·{' '}
            {entry.entry_subtype?.toUpperCase() ?? 'ARCHIVE RECORD'}
          </div>
          <h1 className="text-headline-lg font-headline-lg text-primary tracking-widest uppercase mb-1">
            {entry.title}
          </h1>
          <div className="text-status-strip font-status-strip text-on-surface-variant flex items-center gap-sm">
            <span>FILE NO. {entry.file_no}</span>
            {entry.updated_at && <span>· UPDATED: {entry.updated_at}</span>}
            <Badge level={entry.classification} className="ml-auto" />
          </div>
        </section>

        {/* Image */}
        <section className="border border-outline-variant/30 bg-surface-container relative">
          {entry.image_url ? (
            <>
              <img
                src={entry.image_url}
                alt={entry.title}
                className="w-full h-64 object-cover grayscale opacity-80"
              />
              <div className="absolute bottom-0 left-0 w-full bg-surface-container/90 border-t border-outline-variant/50 p-2 text-status-strip font-status-strip text-secondary flex justify-between">
                <span>ID: {entry.file_no}</span>
                <span>IMG_SRC: ARCHIVE_UPLOAD</span>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-64 bg-surface-bright grayscale opacity-60 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-outline-variant opacity-40"
                  style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
                >
                  {entry.entry_type === 'personnel'
                    ? 'person'
                    : entry.entry_type === 'location'
                    ? 'location_on'
                    : entry.entry_type === 'event'
                    ? 'bolt'
                    : 'description'}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-surface-container/90 border-t border-outline-variant/50 p-2 text-status-strip font-status-strip text-secondary flex justify-between">
                <span>ID: {entry.file_no}</span>
                <span>IMG_SRC: NO_IMAGE_ON_FILE</span>
              </div>
            </>
          )}
        </section>

        {/* Detail grid */}
        {entry.detail_fields && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            {entry.detail_fields.map((field) => (
              <div
                key={field.label}
                className="bg-surface-container p-sm border border-outline-variant/30 flex flex-col gap-1"
              >
                <span className="text-label-sm font-label-sm text-secondary-fixed">
                  {field.label}
                </span>
                <span
                  className={`text-body-md font-body-md ${field.highlight ? 'text-primary' : 'text-on-surface'}`}
                >
                  {field.value}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* Public narrative */}
        <section className="border border-outline-variant/30 bg-surface-container relative p-md">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-container" />
          <h2 className="text-label-caps font-label-caps text-secondary-fixed mb-sm border-b border-outline-variant/20 pb-2">
            {entry.entry_type === 'event' ? 'EVENT REPORT' : 'INCIDENT NARRATIVE'}
          </h2>
          <div className="prose-wiki">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.public_content ?? ''}</ReactMarkdown>
          </div>
        </section>

        {/* Gated content */}
        {entry.is_gated && !isMember ? (
          <GateBlock message={`Classified contact log and full incident report for ${entry.title} are available to archive members.`} />
        ) : entry.is_gated && isMember ? (
          <section className="border border-primary-container/50 bg-surface-container p-md relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-tertiary" />
            <div className="flex items-center gap-sm mb-sm border-b border-outline-variant/20 pb-2">
              <span
                className="material-symbols-outlined text-tertiary text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lock_open
              </span>
              <h2 className="text-label-caps font-label-caps text-tertiary uppercase">
                CLASSIFIED INTEL — MEMBER ACCESS
              </h2>
            </div>
            <div className="prose-wiki">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.gated_content ?? ''}</ReactMarkdown>
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  )
}
