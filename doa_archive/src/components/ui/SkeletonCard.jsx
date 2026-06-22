export function SkeletonCard() {
  return (
    <div className="bg-surface-container-low border border-primary-container/30 relative overflow-hidden">
      <div className="h-1 bg-outline-variant w-full absolute top-0 left-0 animate-pulse" />
      <div className="p-md flex flex-col gap-sm">
        <div className="flex justify-between items-center">
          <div className="h-3 w-32 bg-surface-bright rounded-sm animate-pulse" />
          <div className="h-4 w-20 bg-surface-bright rounded-sm animate-pulse" />
        </div>
        <div className="h-6 w-3/4 bg-surface-bright rounded-sm animate-pulse" />
        <div className="h-4 w-full bg-surface-bright rounded-sm animate-pulse" />
        <div className="h-4 w-5/6 bg-surface-bright rounded-sm animate-pulse" />
        <div className="flex justify-end">
          <div className="h-8 w-28 bg-surface-bright rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  )
}
