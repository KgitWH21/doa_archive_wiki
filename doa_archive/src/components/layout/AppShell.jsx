import { NavLink } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuth } from '../../hooks/useAuth'

export function AppShell({ children }) {
  const { user, logout, isAdmin } = useAuth()

  return (
    <div className="flex flex-col min-h-dvh items-center relative overflow-x-hidden">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline z-50 opacity-20 pointer-events-none" />

      {/* Top AppBar */}
      <header className="bg-surface border-b border-outline-variant flex flex-col w-full max-w-[600px] mx-auto z-40 relative sticky top-0">
        {/* Restricted strip */}
        <div className="h-hazard-height bg-primary-container flex items-center justify-center w-full">
          <span className="text-status-strip font-status-strip text-on-primary-container">
            //_RESTRICTED_//
          </span>
        </div>

        <div className="px-md py-sm flex items-center justify-between">
          <div className="flex items-center gap-xs">
            <span
              className="material-symbols-outlined text-primary filled"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
          </div>
          <h1 className="text-headline-md font-headline-md text-primary font-bold tracking-widest uppercase">
            D.O.A. ARCHIVE
          </h1>
          <div className="flex items-center gap-xs">
            <span
              className={`material-symbols-outlined text-[14px] ${user ? 'text-[#4CAF82]' : 'text-[#E24244]'}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {user ? 'lock_open' : 'lock'}
            </span>
            <span
              className={`text-status-strip font-status-strip uppercase tracking-widest ${user ? 'text-[#4CAF82]' : 'text-[#E24244]'}`}
            >
              {user ? 'LOGGED IN' : 'LOGGED OUT'}
            </span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-row items-center justify-center gap-lg py-xs px-md bg-surface-container-low border-t border-outline-variant">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-label-caps font-label-caps hover:text-primary-fixed-dim transition-colors flex items-center gap-xs ${
                isActive ? 'text-primary font-bold opacity-80' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span> ARCHIVE
          </NavLink>
          <NavLink
            to="/booker"
            className={({ isActive }) =>
              `text-label-caps font-label-caps hover:text-primary-fixed-dim transition-colors flex items-center gap-xs ${
                isActive ? 'text-primary font-bold opacity-80' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span> BOOKER
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-label-caps font-label-caps hover:text-primary-fixed-dim transition-colors flex items-center gap-xs ${
                  isActive ? 'text-primary font-bold opacity-80' : 'text-on-surface-variant'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> ADMIN
            </NavLink>
          )}

          {user ? (
            <button
              onClick={logout}
              className="text-label-caps font-label-caps text-on-surface-variant hover:text-primary-fixed-dim transition-colors flex items-center gap-xs"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span> SIGN OUT
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `text-label-caps font-label-caps hover:text-primary-fixed-dim transition-colors flex items-center gap-xs ${
                  isActive ? 'text-primary font-bold opacity-80' : 'text-on-surface-variant'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">key</span> SIGN IN
            </NavLink>
          )}
        </nav>
      </header>

      {/* Mobile top hazard stripe */}
      <div className="md:hidden hazard-bg h-hazard-height w-full max-w-[600px] opacity-80 border-b border-primary-container" />

      {/* Main content */}
      <main className="w-full max-w-[600px] flex-1 flex flex-col pb-32 md:pb-md pt-md px-md relative z-10">
        {children}
      </main>

      {/* Bottom nav (mobile) */}
      <BottomNav />
    </div>
  )
}
