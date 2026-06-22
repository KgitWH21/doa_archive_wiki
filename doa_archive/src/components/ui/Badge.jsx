const STYLES = {
  unclassified: 'bg-tertiary/10 border-tertiary/30 text-tertiary',
  restricted: 'bg-primary-container/10 border-primary-container/30 text-primary-container',
  ultra: 'bg-error/10 border-error/30 text-error',
}

export function Badge({ level = 'unclassified', className = '' }) {
  const style = STYLES[level] ?? STYLES.unclassified

  return (
    <span
      className={`inline-flex items-center gap-xs px-2 py-0.5 border text-[10px] font-status-strip uppercase tracking-widest rounded-sm ${style} ${className}`}
      style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {level.toUpperCase()}
    </span>
  )
}
