import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const items = [
  { to: '/', label: 'ARCHIVE', icon: 'inventory_2' },
  { to: '/booker', label: 'BOOKER', icon: 'smart_toy' },
]

export function BottomNav() {
  const { user, logout } = useAuth()

  return (
    <nav className="md:hidden bg-surface-container border-t border-outline-variant fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50 flex flex-col">
      <div className="flex w-full">
        {items.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 transition-all ${
                isActive
                  ? 'text-primary border-t-2 border-primary'
                  : 'text-secondary-fixed-dim hover:bg-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined mb-xs text-[22px]">{icon}</span>
            <span className="text-label-caps font-label-caps text-[10px]">{label}</span>
          </NavLink>
        ))}

        {user ? (
          <button
            onClick={logout}
            className="flex-1 flex flex-col items-center justify-center py-2 text-secondary-fixed-dim hover:bg-surface-variant transition-all"
          >
            <span className="material-symbols-outlined mb-xs text-[22px]">logout</span>
            <span className="text-label-caps font-label-caps text-[10px]">SIGN OUT</span>
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 transition-all ${
                isActive
                  ? 'text-primary border-t-2 border-primary'
                  : 'text-secondary-fixed-dim hover:bg-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined mb-xs text-[22px]">key</span>
            <span className="text-label-caps font-label-caps text-[10px]">SIGN IN</span>
          </NavLink>
        )}
      </div>
      <div className="h-hazard-height bg-primary-container flex items-center justify-center">
        <span className="text-status-strip font-status-strip text-on-primary-container">
          //_SECURE_CONNECTION_//
        </span>
      </div>
    </nav>
  )
}
