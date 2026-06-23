import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { useAuth } from '../hooks/useAuth'

export function PaymentSuccessPage() {
  const { refreshProfile, loading } = useAuth()

  useEffect(() => {
    if (!loading) refreshProfile()
  }, [loading])

  return (
    <AppShell>
      <div className="flex flex-col gap-md mt-md">

        {/* Header block */}
        <section className="bg-surface-container border-b border-primary-container p-md relative">
          <div className="text-label-caps font-label-caps text-secondary-fixed mb-xs">
            // TRANSACTION CONFIRMED
          </div>
          <h1 className="text-headline-lg font-headline-lg text-primary tracking-widest uppercase mb-xs">
            ARCHIVE ACCESS GRANTED
          </h1>
          <p className="text-status-strip font-status-strip text-on-surface-variant">
            Member clearance active. All classified records are now available to you.
          </p>
        </section>

        {/* Icon */}
        <div className="flex justify-center py-md">
          <span
            className="material-symbols-outlined text-primary-container"
            style={{ fontSize: '72px', fontVariationSettings: "'FILL' 1" }}
          >
            lock_open
          </span>
        </div>

        {/* Access log */}
        <section className="border border-primary-container/30 bg-surface-container p-md">
          <p className="text-label-caps font-label-caps text-secondary-fixed mb-sm border-b border-outline-variant/20 pb-xs">
            ACCESS LOG
          </p>
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between">
              <span className="text-status-strip font-status-strip text-on-surface-variant">STATUS</span>
              <span className="text-status-strip font-status-strip text-primary-container">MEMBER — FULL CLEARANCE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-status-strip font-status-strip text-on-surface-variant">TIER</span>
              <span className="text-status-strip font-status-strip text-on-surface">ARCHIVE MEMBER</span>
            </div>
            <div className="flex justify-between">
              <span className="text-status-strip font-status-strip text-on-surface-variant">PAYMENT</span>
              <span className="text-status-strip font-status-strip text-on-surface">$1.00 — ONE-TIME</span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <Link
          to="/"
          className="bg-primary-container text-on-primary-fixed font-label-caps text-label-caps px-xl py-sm uppercase hover:bg-primary-fixed-dim transition-colors text-center mt-sm"
        >
          ENTER THE ARCHIVE
        </Link>

      </div>
    </AppShell>
  )
}
