import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { createCheckoutSession } from '../../lib/stripe'

export function GateBlock({ message }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleUnlock() {
    setLoading(true)
    try {
      const url = await createCheckoutSession()
      window.location.href = url
    } catch {
      setLoading(false)
    }
  }

  return (
    <section className="border border-primary-container bg-surface-container p-md relative overflow-hidden">
      <div className="absolute inset-0 hazard-bg opacity-10 pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-md items-center text-center">
        <span
          className="material-symbols-outlined text-primary-container text-4xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          lock
        </span>
        <h3 className="text-headline-md font-headline-md text-primary-container tracking-widest w-full text-center">
          // CLASSIFIED — MEMBERS ONLY //
        </h3>
        <p className="text-body-md font-body-md text-on-surface-variant max-w-96">
          {message ??
            'This content is restricted to archive members. Register or sign in to access classified records.'}
        </p>
        {user ? (
          <button
            onClick={handleUnlock}
            disabled={loading}
            className="bg-primary-container text-on-primary-fixed font-label-caps text-label-caps px-xl py-sm uppercase hover:bg-primary-fixed-dim transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'REDIRECTING...' : 'UNLOCK ACCESS — $1'}
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-primary-container text-on-primary-fixed font-label-caps text-label-caps px-xl py-sm uppercase hover:bg-primary-fixed-dim transition-colors mt-2"
          >
            REQUEST ACCESS
          </Link>
        )}
      </div>
    </section>
  )
}
