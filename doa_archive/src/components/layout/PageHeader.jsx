import doaLogo from '../../assets/ussf_doa_logo.png'

export function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-surface-container-low border-b border-primary-container p-md mb-md">
      {eyebrow && (
        <p className="text-status-strip font-status-strip text-secondary mb-xs uppercase opacity-70">
          {eyebrow}
        </p>
      )}
      <div className="flex items-center gap-sm min-w-0">
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container bg-white/90"
          style={{ boxShadow: '0 0 10px rgba(184,146,42,0.3)' }}>
          <img src={doaLogo} alt="DOA Logo" className="w-full h-full object-contain p-1" />
        </div>
        <h2 className="text-headline-lg font-headline-lg text-primary uppercase tracking-wide mb-xs min-w-0 truncate">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mt-xs">
          {subtitle}
        </p>
      )}
    </section>
  )
}
