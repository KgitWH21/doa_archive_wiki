import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AlertBar } from '../ui/AlertBar'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message ?? 'Authentication failed. Verify credentials and retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-md">
      <div className="bg-surface-container border border-outline-variant/30 p-md">
        <p className="text-label-caps font-label-caps text-secondary-fixed mb-xs">
          // SECURE ACCESS TERMINAL
        </p>
        <h2 className="text-headline-lg font-headline-lg text-primary uppercase tracking-widest mb-xs">
          OPERATIVE LOGIN
        </h2>
        <p className="text-status-strip font-status-strip text-on-surface-variant">
          AUTHENTICATED SESSIONS ONLY
        </p>
      </div>

      {error && (
        <AlertBar
          type="error"
          title="ACCESS DENIED"
          message={error}
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        <div className="flex flex-col gap-xs">
          <label className="text-label-caps font-label-caps text-secondary-fixed uppercase">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
              alternate_email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="operative@doa.gov"
              className="w-full bg-[#0A1628] border border-[#7A9CB8] text-on-background pl-10 pr-4 py-3 font-status-strip text-status-strip placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-0 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="text-label-caps font-label-caps text-secondary-fixed uppercase">
            ACCESS CODE
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
              lock
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#0A1628] border border-[#7A9CB8] text-on-background pl-10 pr-4 py-3 font-status-strip text-status-strip placeholder:text-on-surface-variant/50 focus:border-primary-container focus:ring-0 focus:outline-none transition-colors tracking-widest"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-container text-[#0A1628] font-label-caps text-label-caps uppercase py-4 mt-sm hover:bg-primary-fixed-dim transition-colors font-bold tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">login</span>
          {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="w-full bg-[#0D1E3A] border border-primary-container/30 text-primary font-label-caps text-label-caps uppercase py-4 hover:bg-[#0A1628] transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          REQUEST MEMBERSHIP
        </button>
      </form>

      <p className="text-center text-status-strip font-status-strip text-on-surface-variant">
        New operative?{' '}
        <Link to="/register" className="text-primary hover:text-primary-fixed-dim underline">
          REGISTER HERE
        </Link>
      </p>
    </div>
  )
}
