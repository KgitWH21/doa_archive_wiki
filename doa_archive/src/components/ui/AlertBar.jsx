const STYLES = {
  error: 'bg-error-container/20 border-error text-error',
  warning: 'bg-primary-container/20 border-primary-container text-primary-container',
  info: 'bg-tertiary/10 border-tertiary text-tertiary',
}

export function AlertBar({ type = 'error', title, message }) {
  const style = STYLES[type] ?? STYLES.error

  return (
    <div className={`border p-sm ${style}`}>
      {title && (
        <p className="text-label-caps font-label-caps uppercase tracking-widest mb-xs">{title}</p>
      )}
      {message && <p className="text-body-md font-body-md opacity-80">{message}</p>}
    </div>
  )
}
