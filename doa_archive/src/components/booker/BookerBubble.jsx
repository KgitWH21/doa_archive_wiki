import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/constants'

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
            GUEST_OPERATIVE · {message.timestamp}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start max-w-[90%]">
      <div className="bg-surface-container border border-primary/20 border-l-4 border-l-primary p-md rounded-sm w-full">
        <p className="text-body-md font-body-md text-on-surface leading-relaxed">
          {message.content}
        </p>

        {message.results && message.results.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-sm">
            {message.results.map((r) => (
              <Link
                key={r.slug}
                to={ROUTES.entry(r.slug)}
                className="bg-surface border border-tertiary-container/50 px-3 py-1.5 flex items-center gap-2 hover:bg-tertiary-container/10 transition-colors rounded-sm text-tertiary text-label-caps font-label-caps"
              >
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                VIEW {r.title.toUpperCase().slice(0, 18)} FILE
                <span className="material-symbols-outlined text-[14px]">arrow_forward_ios</span>
              </Link>
            ))}
          </div>
        )}

        <p className="text-status-strip font-status-strip text-on-surface-variant mt-xs">
          BOOKER · {message.timestamp}
        </p>
      </div>
    </div>
  )
}
