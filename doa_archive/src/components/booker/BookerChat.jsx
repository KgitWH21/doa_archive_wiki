import { useEffect, useRef } from 'react'
import { BookerBubble } from './BookerBubble'

export function BookerChat({ messages, isLoading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-md px-md py-md">
      {/* Session start divider */}
      <div className="flex items-center gap-sm">
        <div className="flex-1 h-px bg-outline-variant/50" />
        <span className="text-status-strip font-status-strip text-on-surface-variant opacity-60">
          SESSION START
        </span>
        <div className="flex-1 h-px bg-outline-variant/50" />
      </div>

      {messages.map((msg) => (
        <BookerBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex items-start max-w-[90%]">
          <div className="bg-surface-container border border-primary/20 border-l-4 border-l-primary p-md rounded-sm">
            <div className="flex items-center gap-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300" />
              <span className="text-label-caps font-label-caps text-on-surface-variant ml-xs">
                PROCESSING QUERY...
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
