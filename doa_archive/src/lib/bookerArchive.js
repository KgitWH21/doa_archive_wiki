import { supabase } from './supabase'

const SEARCH_LIMIT = 75
const RESULT_LIMIT = 4

const STOP_WORDS = new Set([
  'about',
  'archive',
  'booker',
  'can',
  'entry',
  'file',
  'find',
  'for',
  'from',
  'give',
  'have',
  'info',
  'into',
  'look',
  'me',
  'on',
  'please',
  'preview',
  'read',
  'records',
  'search',
  'show',
  'tell',
  'the',
  'this',
  'what',
  'who',
  'with',
])

function normalizeText(value = '') {
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSearchTerms(query) {
  return normalizeText(query)
    .split(' ')
    .map((term) => term.trim())
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term))
}

function normalizeEntry(row) {
  return {
    ...row,
    entry_type: row.type ?? row.entry_type,
    public_content: row.summary ?? row.public_content ?? '',
  }
}

function getPreview(entry, isMember) {
  const publicPreview = entry.public_content || 'No public synopsis is available for this file.'

  if (!entry.is_gated) return publicPreview

  if (isMember && entry.gated_content) {
    return `${publicPreview} Member preview: ${entry.gated_content}`
  }

  return `${publicPreview} Classified sections require member access.`
}

function truncate(value, maxLength = 220) {
  if (!value || value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trim()}...`
}

function scoreEntry(entry, terms, normalizedQuery) {
  const title = normalizeText(entry.title)
  const slug = normalizeText(entry.slug)
  const type = normalizeText(entry.entry_type)
  const subtype = normalizeText(entry.entry_subtype)
  const summary = normalizeText(entry.public_content)
  const status = normalizeText(entry.status)
  const fileNo = normalizeText(entry.file_no)

  let score = 0

  if (title && normalizedQuery.includes(title)) score += 14
  if (slug && normalizedQuery.includes(slug)) score += 10
  if (fileNo && normalizedQuery.includes(fileNo)) score += 8

  for (const term of terms) {
    if (title.includes(term)) score += 7
    if (slug.includes(term)) score += 6
    if (fileNo.includes(term)) score += 5
    if (type.includes(term)) score += 3
    if (subtype.includes(term)) score += 3
    if (status.includes(term)) score += 2
    if (summary.includes(term)) score += 2
  }

  return score
}

export async function fetchPublishedEntries(isMember) {
  const selectFields = [
    'id',
    'title',
    'slug',
    'type',
    'summary',
    'classification',
    'status',
    'file_no',
    'is_gated',
    'is_published',
    'updated_at',
  ]

  if (isMember) selectFields.push('gated_content')

  const { data, error } = await supabase
    .from('entries')
    .select(selectFields.join(', '))
    .eq('is_published', true)
    .order('updated_at', { ascending: false })
    .limit(SEARCH_LIMIT)

  if (error) throw error

  return (data ?? []).map(normalizeEntry)
}

export function findEntryPreviews(entries, query, isMember) {
  const normalizedQuery = normalizeText(query)
  const terms = getSearchTerms(query)
  const wantsRecent =
    terms.length === 0 || /\b(all|latest|new|recent|records|entries|files)\b/i.test(query)

  const matches = entries
    .map((entry) => ({ entry, score: scoreEntry(entry, terms, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RESULT_LIMIT)
    .map(({ entry }) => toBookerResult(entry, isMember))

  if (matches.length > 0) return matches

  if (wantsRecent) {
    return entries.slice(0, RESULT_LIMIT).map((entry) => toBookerResult(entry, isMember))
  }

  return []
}

export function toBookerResult(entry, isMember) {
  return {
    slug: entry.slug,
    title: entry.title,
    entry_type: entry.entry_type,
    entry_subtype: entry.entry_subtype,
    classification: entry.classification ?? 'unclassified',
    status: entry.status,
    file_no: entry.file_no,
    is_gated: entry.is_gated,
    preview: truncate(getPreview(entry, isMember)),
  }
}

export function formatBookerResponse(query, results, isMember) {
  if (results.length === 0) {
    return `QUERY RECEIVED. I searched the archive for "${query}". No specific records matched that request. Try an operative name, location designation, event codename, file number, or entry type. ${
      isMember ? 'Member clearance is active.' : 'Public records are limited. Member access unlocks classified previews.'
    }`
  }

  const accessNote = isMember
    ? 'Member clearance active. Classified previews may be included where available.'
    : 'Public preview mode. Classified sections remain sealed.'

  const list = results
    .map((entry, index) => {
      const type = entry.entry_subtype
        ? `${entry.entry_type} / ${entry.entry_subtype}`
        : entry.entry_type
      return `${index + 1}. ${entry.title} (${type}) - ${entry.preview}`
    })
    .join('\n')

  return `ARCHIVE MATCHES FOUND FOR "${query}". ${accessNote}\n\n${list}`
}
