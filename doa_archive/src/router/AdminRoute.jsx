import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppShell } from '../components/layout/AppShell'

export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center gap-md mt-xl text-center">
          <span
            className="material-symbols-outlined text-error"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
          >
            gpp_bad
          </span>
          <div>
            <p className="text-label-caps font-label-caps text-error uppercase tracking-widest mb-xs">
              // ACCESS DENIED
            </p>
            <h2 className="text-headline-lg font-headline-lg text-primary uppercase tracking-widest mb-xs">
              RESTRICTED TERMINAL
            </h2>
            <p className="text-status-strip font-status-strip text-on-surface-variant">
              ADMIN CLEARANCE REQUIRED. THIS ACCESS ATTEMPT HAS BEEN LOGGED.
            </p>
          </div>
        </div>
      </AppShell>
    )
  }

  return children
}
