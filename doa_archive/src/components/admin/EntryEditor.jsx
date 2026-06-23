import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { ENTRY_TYPES, CLASSIFICATION_LEVELS } from '../../lib/constants'
import { AlertBar } from '../ui/AlertBar'
import { MarkdownEditor } from '../ui/MarkdownEditor'

const EMPTY_FORM = {
  title: '',
  slug: '',
  type: 'personnel',
  classification: 'unclassified',
  status: 'active',
  file_no: '',
  summary: '',
  gated_content: '',
  is_gated: false,
  is_published: false,
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function EntryEditor({ entry = null }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = entry !== null

  const [form, setForm] = useState(
    isEditing
      ? {
          title: entry.title ?? '',
          slug: entry.slug ?? '',
          type: entry.type ?? 'personnel',
          classification: entry.classification ?? 'unclassified',
          status: entry.status ?? 'active',
          file_no: entry.file_no ?? '',
          summary: entry.summary ?? '',
          gated_content: entry.gated_content ?? '',
          is_gated: entry.is_gated ?? false,
          is_published: entry.is_published ?? false,
        }
      : EMPTY_FORM
  )

  const [detailFields, setDetailFields] = useState(
    isEditing && Array.isArray(entry.detail_fields) ? entry.detail_fields : []
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleTitleChange(e) {
    const title = e.target.value
    setForm((f) => ({ ...f, title, slug: slugify(title) }))
  }

  function addDetailField() {
    setDetailFields((f) => [...f, { label: '', value: '', highlight: false }])
  }

  function updateDetailField(i, key, value) {
    setDetailFields((f) => f.map((field, idx) => idx === i ? { ...field, [key]: value } : field))
  }

  function removeDetailField(i) {
    setDetailFields((f) => f.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      ...form,
      detail_fields: detailFields.filter((f) => f.label.trim()),
      updated_at: new Date().toISOString(),
    }

    let result
    if (isEditing) {
      result = await supabase.from('entries').update(payload).eq('id', entry.id)
    } else {
      result = await supabase.from('entries').insert({ ...payload, created_by: user.id }).select('id').single()
    }

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
      return
    }

    const savedId = isEditing ? entry.id : result.data?.id
    console.log('[embed] savedId:', savedId)
    if (savedId) {
      console.log('[embed] invoking embed-entry...')
      const { data: embedData, error: embedError } = await supabase.functions.invoke('embed-entry', {
        body: { entry_id: savedId },
      })
      console.log('[embed] result:', embedData, embedError)
    } else {
      console.warn('[embed] no savedId — skipping')
    }

    navigate('/admin')
  }

  const inputClass =
    'w-full bg-[#0A1628] border border-[#7A9CB8] text-on-background px-3 py-2 font-status-strip text-status-strip placeholder:text-on-surface-variant/50 focus:border-primary-container focus:outline-none transition-colors'
  const labelClass = 'text-label-caps font-label-caps text-secondary-fixed uppercase'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-md">
      {error && <AlertBar type="error" title="SAVE FAILED" message={error} />}

      {/* Title + Slug */}
      <div className="flex flex-col gap-xs">
        <label className={labelClass}>TITLE</label>
        <input
          type="text"
          value={form.title}
          onChange={handleTitleChange}
          required
          placeholder="Entry title"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-xs">
        <label className={labelClass}>SLUG</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => set('slug', e.target.value)}
          required
          placeholder="auto-generated-from-title"
          className={inputClass}
        />
      </div>

      {/* Type + Classification */}
      <div className="grid grid-cols-2 gap-sm">
        <div className="flex flex-col gap-xs">
          <label className={labelClass}>TYPE</label>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            className={inputClass}
          >
            {ENTRY_TYPES.map((t) => (
              <option key={t} value={t}>{t.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-xs">
          <label className={labelClass}>CLASSIFICATION</label>
          <select
            value={form.classification}
            onChange={(e) => set('classification', e.target.value)}
            className={inputClass}
          >
            {CLASSIFICATION_LEVELS.map((c) => (
              <option key={c} value={c}>{c.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status + File No */}
      <div className="grid grid-cols-2 gap-sm">
        <div className="flex flex-col gap-xs">
          <label className={labelClass}>STATUS</label>
          <input
            type="text"
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            placeholder="active"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className={labelClass}>FILE NO.</label>
          <input
            type="text"
            value={form.file_no}
            onChange={(e) => set('file_no', e.target.value)}
            placeholder="DOA-0001"
            className={inputClass}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-xs">
        <label className={labelClass}>SUMMARY (PUBLIC)</label>
        <MarkdownEditor
          value={form.summary}
          onChange={(val) => set('summary', val)}
          rows={6}
          placeholder="Public-facing narrative..."
        />
      </div>

      {/* Gated content */}
      <div className="flex flex-col gap-xs">
        <label className={labelClass}>CLASSIFIED CONTENT (MEMBERS ONLY)</label>
        <MarkdownEditor
          value={form.gated_content}
          onChange={(val) => set('gated_content', val)}
          rows={6}
          placeholder="Restricted intel — members only..."
        />
      </div>

      {/* Flags */}
      <div className="flex items-center gap-lg">
        <label className="flex items-center gap-xs cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_gated}
            onChange={(e) => set('is_gated', e.target.checked)}
            className="accent-[#B8922A] w-4 h-4"
          />
          <span className={labelClass}>GATED</span>
        </label>
        <label className="flex items-center gap-xs cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => set('is_published', e.target.checked)}
            className="accent-[#B8922A] w-4 h-4"
          />
          <span className={labelClass}>PUBLISHED</span>
        </label>
      </div>

      {/* Detail fields */}
      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <label className={labelClass}>DETAIL FIELDS</label>
          <button
            type="button"
            onClick={addDetailField}
            className="text-label-caps font-label-caps text-primary hover:text-primary-fixed-dim flex items-center gap-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            ADD FIELD
          </button>
        </div>
        {detailFields.map((field, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-xs items-center">
            <input
              type="text"
              value={field.label}
              onChange={(e) => updateDetailField(i, 'label', e.target.value)}
              placeholder="LABEL"
              className={inputClass}
            />
            <input
              type="text"
              value={field.value}
              onChange={(e) => updateDetailField(i, 'value', e.target.value)}
              placeholder="VALUE"
              className={inputClass}
            />
            <label className="flex items-center gap-xs cursor-pointer">
              <input
                type="checkbox"
                checked={field.highlight}
                onChange={(e) => updateDetailField(i, 'highlight', e.target.checked)}
                className="accent-[#B8922A] w-4 h-4"
              />
              <span className="text-label-caps font-label-caps text-secondary-fixed text-[10px]">HL</span>
            </label>
            <button
              type="button"
              onClick={() => removeDetailField(i)}
              className="text-error hover:text-error/70 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-sm mt-sm">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary-container text-[#0A1628] font-label-caps text-label-caps uppercase py-4 hover:bg-primary-fixed-dim transition-colors font-bold tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {loading ? 'SAVING...' : isEditing ? 'SAVE CHANGES' : 'CREATE ENTRY'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="bg-[#0D1E3A] border border-primary-container/30 text-primary font-label-caps text-label-caps uppercase px-md py-4 hover:bg-[#0A1628] transition-colors"
        >
          CANCEL
        </button>
      </div>
    </form>
  )
}
