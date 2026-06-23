import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/constants'

function formatMeta(result) {
  return [result.file_no, result.entry_type, result.entry_subtype].filter(Boolean).join(' / ')
}

export function BookerBubble({ message }) {
  const isBot = message.role === 'bot'

  if (!isBot) {
    return (
      <div className="flex items-end self-end max-w-[85%]">
        <div className="bg-surface-container-high border border-outline-variant/50 p-md rounded-sm">
          <p className="text-body-md font-body-md text-on-surface text-right">
            {message.content}
          </p>
          <p className="text-status-strip font-status-strip text-on-surface-variant text-right mt-xs">
            GUEST_OPERATIVE / {message.timestamp}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start max-w-[90%]">
      <div className="bg-surface-container border border-primary/20 border-l-4 border-l-primary p-md rounded-sm w-full">
        <p className="text-body-md font-body-md text-on-surface leading-relaxed whitespace-pre-line">
          {message.content}
        </p>

        {message.results && message.results.length > 0 && (
          <div className="flex flex-col gap-sm mt-sm">
            {message.results.map((result) => (
              <Link
                key={result.slug}
                to={ROUTES.entry(result.slug)}
                className="bg-surface border border-tertiary-container/50 p-sm hover:bg-tertiary-container/10 transition-colors rounded-sm group"
              >
                <div className="flex items-start justify-between gap-sm">
                  <div>
                    <p className="text-label-caps font-label-caps text-tertiary uppercase">
                      {formatMeta(result)}
                    </p>
                    <h3 className="text-body-md font-body-md text-on-surface uppercase tracking-wide mt-1">
                      {result.title}
                    </h3>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-tertiary group-hover:translate-x-0.5 transition-transform">
                    arrow_forward_ios
                  </span>
                </div>

                <p className="text-sm font-body-md text-on-surface-variant mt-xs leading-relaxed">
                  {result.preview}
                </p>

                <div className="flex flex-wrap items-center gap-xs mt-sm">
                  <span className="border border-primary-container/40 px-2 py-0.5 text-status-strip font-status-strip text-primary-container uppercase">
                    {(result.classification ?? 'unclassified').toUpperCase()}
                  </span>
                  {result.status && (
                    <span className="border border-outline-variant/50 px-2 py-0.5 text-status-strip font-status-strip text-on-surface-variant uppercase">
                      {result.status}
                    </span>
                  )}
                  {result.is_gated && (
                    <span className="border border-error/40 px-2 py-0.5 text-status-strip font-status-strip text-error uppercase">
                      MEMBER INTEL
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <p className="text-status-strip font-status-strip text-on-surface-variant mt-xs">
          BOOKER / {message.timestamp}
        </p>
      </div>
    </div>
  )
}
