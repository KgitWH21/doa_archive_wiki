import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { useAuth } from '../hooks/useAuth'

export function PaymentSuccessPage() {
  const { refreshProfile } = useAuth()

  useEffect(() => {
    refreshProfile()
  }, [])

  return (
    <AppShell>
      <div className="flex flex-col items-center text-center gap-lg py-xl">
        <span
          className="material-symbols-outlined text-primary-container"
          style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
        >
          lock_open
        </span>

        <div className="flex flex-col gap-sm">
          <p className="text-label-caps font-label-caps text-secondary-fixed tracking-widest">
            TRANSACTION CONFIRMED
          </p>
          <h1 className="text-headline-lg font-headline-lg text-primary tracking-widest uppercase">
            ARCHIVE ACCESS GRANTED
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-sm mx-auto">
            Member clearance active. All classified records are now available to you.
          </p>
        </div>

        <div className="border border-primary-container/30 bg-surface-container p-md w-full max-w-sm text-left">
          <p className="text-label-caps font-label-caps text-secondary-fixed mb-xs">ACCESS LOG</p>
          <p className="text-status-strip font-status-strip text-on-surface-variant">
            STATUS: <span className="text-primary-container">MEMBER — FULL CLEARANCE</span>
          </p>
          <p className="text-status-strip font-status-strip text-on-surface-variant">
            TIER: <span className="text-on-surface">ARCHIVE MEMBER</span>
          </p>
          <p className="text-status-strip font-status-strip text-on-surface-variant">
            PAYMENT: <span className="text-on-surface">$1.00 — ONE-TIME</span>
          </p>
        </div>

        <Link
          to="/"
          className="bg-primary-container text-on-primary-fixed font-label-caps text-label-caps px-xl py-sm uppercase hover:bg-primary-fixed-dim transition-colors"
        >
          ENTER THE ARCHIVE
        </Link>
      </div>
    </AppShell>
  )
}
