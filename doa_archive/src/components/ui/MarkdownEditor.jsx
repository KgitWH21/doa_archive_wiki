import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const TOOLS = [
  { label: 'H1', syntax: '# ', block: true },
  { label: 'H2', syntax: '## ', block: true },
  { label: 'H3', syntax: '### ', block: true },
  { label: 'B', syntax: '**', wrap: true, title: 'Bold' },
  { label: 'I', syntax: '_', wrap: true, title: 'Italic' },
  { label: '—', syntax: '\n---\n', insert: true, title: 'Divider' },
  { label: '• List', syntax: '- ', block: true },
]

export function MarkdownEditor({ value, onChange, rows = 6, placeholder }) {
  const [preview, setPreview] = useState(false)
  const ref = useRef(null)

  function applyTool(tool) {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    let next = value

    if (tool.wrap) {
      const wrapped = `${tool.syntax}${selected || 'text'}${tool.syntax}`
      next = value.slice(0, start) + wrapped + value.slice(end)
    } else if (tool.block) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1
      next = value.slice(0, lineStart) + tool.syntax + value.slice(lineStart)
    } else if (tool.insert) {
      next = value.slice(0, start) + tool.syntax + value.slice(end)
    }

    onChange(next)
    setTimeout(() => el.focus(), 0)
  }

  const inputClass =
    'w-full bg-[#0A1628] border border-[#7A9CB8] text-on-background px-3 py-2 font-status-strip text-status-strip placeholder:text-on-surface-variant/50 focus:border-primary-container focus:outline-none transition-colors resize-y'

  return (
    <div className="flex flex-col gap-xs">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.title ?? t.label}
            onClick={() => applyTool(t)}
            className="px-2 py-1 bg-[#0D1E3A] border border-[#7A9CB8]/40 text-secondary-fixed font-label-caps text-[11px] hover:border-primary-container hover:text-primary transition-colors"
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="px-2 py-1 bg-[#0D1E3A] border text-[11px] font-label-caps transition-colors"
            style={{
              borderColor: preview ? '#b8922a' : 'rgba(122,156,184,0.4)',
              color: preview ? '#b8922a' : '#d7e2ff',
            }}
          >
            {preview ? 'EDIT' : 'PREVIEW'}
          </button>
        </div>
      </div>

      {/* Editor or Preview */}
      {preview ? (
        <div className="min-h-[6rem] bg-[#0A1628] border border-[#7A9CB8] px-3 py-2 prose-wiki">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <span className="text-on-surface-variant/50 font-status-strip text-status-strip">
              Nothing to preview yet.
            </span>
          )}
        </div>
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  )
}
