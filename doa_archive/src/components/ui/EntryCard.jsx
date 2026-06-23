import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/constants'

const CLASSIFICATION_COLORS = {
  unclassified: { bar: 'bg-tertiary', badge: 'bg-tertiary/10 border-tertiary/30 text-tertiary' },
  restricted: {
    bar: 'bg-primary-container',
    badge: 'bg-primary-container/10 border-primary-container/30 text-primary-container',
  },
  ultra: { bar: 'bg-error', badge: 'bg-error/10 border-error/30 text-error' },
}

export function EntryCard({ entry }) {
  const colors = CLASSIFICATION_COLORS[entry.classification] ?? CLASSIFICATION_COLORS.unclassified

  return (
    <article className="bg-surface-container-low border border-primary-container/30 relative overflow-hidden group">
      {/* Classification color bar */}
      <div className={`h-1 ${colors.bar} w-full absolute top-0 left-0`} />

      <div className="p-md">
        {/* Meta row */}
        <div className="flex justify-between items-start mb-sm border-b border-secondary/20 pb-xs">
          <span className="text-label-sm font-label-sm text-secondary uppercase tracking-widest opacity-80">
            {entry.entry_type}
            {entry.entry_subtype ? ` · ${entry.entry_subtype}` : ''}
          </span>
          <div className={`flex items-center gap-xs px-2 py-0.5 border rounded-sm ${colors.badge}`}>
            <div className={`w-2 h-2 rounded-full ${colors.bar}`} />
            <span className="text-[10px] font-status-strip uppercase tracking-widest">
              {(entry.classification ?? 'unclassified').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-headline-md font-headline-md text-on-surface mb-xs uppercase tracking-wide">
          {entry.title}
        </h3>

        {/* Description */}
        <p className="text-body-md font-body-md text-on-surface-variant opacity-90 leading-relaxed mb-md">
          {entry.public_content
            ? entry.public_content.length > 120
              ? entry.public_content.slice(0, 120) + '...'
              : entry.public_content
            : '—'}
        </p>

        {/* Action */}
        <div className="flex justify-between items-center pt-sm border-t border-secondary/20">
          {entry.is_gated && (
            <div className="flex items-center gap-xs text-[10px] font-status-strip text-on-surface-variant uppercase tracking-widest opacity-70">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              MEMBERS ONLY
            </div>
          )}
          <Link
            to={ROUTES.entry(entry.slug)}
            className="bg-surface-bright text-primary text-label-caps font-label-caps px-sm py-xs border border-primary-container/50 hover:bg-primary-container/20 hover:border-primary-container transition-colors flex items-center gap-xs uppercase ml-auto"
          >
            READ ENTRY{' '}
            <span className="material-symbols-outlined text-[14px]">arrow_forward_ios</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
