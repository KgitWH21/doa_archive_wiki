export function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-surface-container-low border-b border-primary-container p-md mb-md">
      {eyebrow && (
        <p className="text-status-strip font-status-strip text-secondary mb-xs uppercase opacity-70">
          {eyebrow}
        </p>
      )}
      <h2 className="text-headline-lg font-headline-lg text-primary uppercase mb-xs tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="text-label-caps font-label-caps text-on-surface-variant uppercase">
          {subtitle}
        </p>
      )}
    </section>
  )
}
