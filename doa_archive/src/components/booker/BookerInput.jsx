import { useState } from 'react'

export function BookerInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-sm px-md py-sm bg-background border-t border-outline-variant"
    >
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline text-[18px]">
          terminal
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={disabled}
          placeholder="QUERY THE ARCHIVE..."
          className="w-full bg-background border border-outline-variant text-on-surface text-label-caps font-label-caps py-3 pl-10 pr-4 focus:outline-none focus:border-primary rounded-sm placeholder:text-on-surface-variant/50 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-md py-3 flex items-center justify-center hover:bg-primary-fixed-dim transition-colors rounded-sm font-bold min-w-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        SEND
      </button>
    </form>
  )
}
