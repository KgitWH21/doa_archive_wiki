import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { AlertBar } from '../ui/AlertBar'

export function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError('ACCESS CODES DO NOT MATCH — reenter and retry.')
      return
    }
    if (password.length < 8) {
      setError('ACCESS CODE TOO SHORT — minimum 8 characters required.')
      return
    }
    setLoading(true)
    try {
      await register(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message ?? 'Registration failed. Contact your DOA liaison.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-md">
      <div className="bg-surface-container border border-outline-variant/30 p-md">
        <p className="text-label-caps font-label-caps text-secondary-fixed mb-xs">
          // MEMBERSHIP APPLICATION
        </p>
        <h2 className="text-headline-lg font-headline-lg text-primary uppercase tracking-widest mb-xs">
          NEW OPERATIVE
        </h2>
        <p className="text-status-strip font-status-strip text-on-surface-variant">
          REGISTRATION REQUIRES EMAIL CONFIRMATION
        </p>
      </div>

      {error && <AlertBar type="error" title="REGISTRATION ERROR" message={error} />}

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
              placeholder="operative@email.com"
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

        <div className="flex flex-col gap-xs">
          <label className="text-label-caps font-label-caps text-secondary-fixed uppercase">
            CONFIRM ACCESS CODE
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
              lock_reset
            </span>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          {loading ? 'REGISTERING...' : 'REGISTER OPERATIVE'}
        </button>
      </form>

      <p className="text-center text-status-strip font-status-strip text-on-surface-variant">
        Already registered?{' '}
        <Link to="/login" className="text-primary hover:text-primary-fixed-dim underline">
          SIGN IN HERE
        </Link>
      </p>
    </div>
  )
}
