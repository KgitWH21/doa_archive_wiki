import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'

export function NotFoundPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center flex-1 py-xl text-center gap-lg">
        <div className="hazard-bg w-full h-hazard-height opacity-60" />

        <div className="flex flex-col items-center gap-md">
          <span
            className="material-symbols-outlined text-error"
            style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
          >
            report
          </span>

          <div
            className="inline-flex items-center gap-xs px-3 py-1 border border-error/30 bg-error/10 text-error text-[10px] font-status-strip uppercase tracking-widest"
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            ERROR 404
          </div>

          <h1 className="text-headline-lg font-headline-lg text-primary uppercase tracking-widest">
            RECORD NOT FOUND
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-72">
            The requested archive record does not exist or has been classified beyond your clearance
            level.
          </p>
        </div>

        <Link
          to="/"
          className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-xl py-sm flex items-center gap-xs hover:bg-primary-fixed-dim transition-colors uppercase"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          RETURN TO ARCHIVE
        </Link>

        <div className="hazard-bg w-full h-hazard-height opacity-60" />
      </div>
    </AppShell>
  )
}
