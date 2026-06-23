import { useState, useRef } from 'react'
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
  image_url: '',
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
          image_url: entry.image_url ?? '',
        }
      : EMPTY_FORM
  )

  const [detailFields, setDetailFields] = useState(
    isEditing && Array.isArray(entry.detail_fields) ? entry.detail_fields : []
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('entry-images')
      .upload(path, file, { upsert: false })
    if (uploadError) {
      setError(`Image upload failed: ${uploadError.message}`)
      setUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from('entry-images').getPublicUrl(path)
    set('image_url', publicUrl)
    setUploading(false)
  }

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

      {/* Image */}
      <div className="flex flex-col gap-xs">
        <label className={labelClass}>ENTRY IMAGE</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        {form.image_url ? (
          <div className="relative">
            <img
              src={form.image_url}
              alt="Entry"
              className="w-full h-40 object-cover border border-[#7A9CB8] grayscale opacity-80"
            />
            <div className="absolute top-0 right-0 flex gap-xs p-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-surface-container border border-[#7A9CB8]/60 px-2 py-1 text-[11px] font-label-caps text-secondary-fixed hover:border-primary-container hover:text-primary transition-colors"
              >
                REPLACE
              </button>
              <button
                type="button"
                onClick={() => set('image_url', '')}
                className="bg-surface-container border border-error/40 px-2 py-1 text-[11px] font-label-caps text-error hover:border-error transition-colors"
              >
                REMOVE
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-28 border border-dashed border-[#7A9CB8]/40 flex flex-col items-center justify-center gap-xs text-on-surface-variant hover:border-primary-container hover:text-primary transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[28px]">
              {uploading ? 'hourglass_empty' : 'add_photo_alternate'}
            </span>
            <span className="text-[11px] font-label-caps">
              {uploading ? 'UPLOADING...' : 'UPLOAD IMAGE'}
            </span>
          </button>
        )}
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
