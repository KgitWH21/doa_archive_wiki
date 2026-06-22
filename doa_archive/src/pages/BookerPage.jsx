import bookerImg from '../assets/booker_capybara.png'
import { BookerChat } from '../components/booker/BookerChat'
import { BookerInput } from '../components/booker/BookerInput'
import { useBooker } from '../hooks/useBooker'

export function BookerPage() {
  const { messages, sendMessage, isLoading } = useBooker()

  return (
    <div className="flex flex-col h-dvh items-center bg-background overflow-hidden relative">
      <div className="fixed inset-0 scanline z-50 opacity-20 pointer-events-none" />

      <div className="w-full max-w-[600px] h-full flex flex-col relative bg-surface border-l border-r border-outline-variant/30">

        {/* Top bar */}
        <header className="flex flex-col w-full flex-shrink-0">
          <div className="h-hazard-height bg-primary-container flex items-center justify-center w-full">
            <span className="text-status-strip font-status-strip text-on-primary-container">
              //_RESTRICTED_//
            </span>
          </div>
          <div className="bg-surface border-b border-outline-variant flex items-center justify-between px-md py-sm">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              security
            </span>
            <span className="text-label-caps font-label-caps text-primary tracking-widest">
              D.O.A. ARCHIVE
            </span>
            <span className="material-symbols-outlined text-primary">terminal</span>
          </div>
        </header>

        {/* Booker identity header */}
        <div className="bg-surface-container-low border-b border-outline-variant/50 p-md flex items-center gap-md flex-shrink-0">
          <img
            src={bookerImg}
            alt="Booker — DOA Archive AI Liaison"
            className="w-16 h-16 rounded-sm border border-primary/50 object-cover"
            style={{ boxShadow: '0 0 15px rgba(184,146,42,0.2)' }}
          />
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-widest">
              DOA ARCHIVE · AI LIAISON
            </p>
            <h2 className="text-headline-md font-headline-md text-primary uppercase tracking-widest">
              BOOKER
            </h2>
            <div className="flex items-center gap-xs mt-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary animate-pulse" />
              <span className="text-status-strip font-status-strip text-on-surface-variant">
                SEMANTIC ARCHIVE INTERFACE · ACTIVE SESSION
              </span>
            </div>
          </div>
        </div>

        {/* Chat messages (scrollable) */}
        <BookerChat messages={messages} isLoading={isLoading} />

        {/* Input */}
        <BookerInput onSend={sendMessage} disabled={isLoading} />

        {/* Mobile bottom nav */}
        <nav className="md:hidden bg-surface-container border-t border-outline-variant flex flex-col w-full flex-shrink-0">
          <div className="flex w-full">
            {[
              { to: '/', label: 'ARCHIVE', icon: 'inventory_2' },
              { label: 'BOOKER', icon: 'smart_toy', active: true },
              { to: '/login', label: 'SIGN IN', icon: 'key' },
            ].map((item, i) =>
              item.to ? (
                <a
                  key={i}
                  href={item.to}
                  className="flex-1 flex flex-col items-center justify-center py-2 text-secondary-fixed-dim hover:bg-surface-variant transition-all"
                >
                  <span className="material-symbols-outlined text-[22px] mb-xs">{item.icon}</span>
                  <span className="text-label-caps font-label-caps text-[10px]">{item.label}</span>
                </a>
              ) : (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-center py-2 text-primary border-t-2 border-primary bg-surface-variant/20"
                >
                  <span
                    className="material-symbols-outlined text-[22px] mb-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-label-caps font-label-caps text-[10px]">{item.label}</span>
                </div>
              )
            )}
          </div>
          <div className="h-hazard-height bg-primary-container flex items-center justify-center">
            <span className="text-status-strip font-status-strip text-on-primary-container">
              //_SECURE_CONNECTION_//
            </span>
          </div>
        </nav>
      </div>
    </div>
  )
}
