import { createClient } from 'npm:@supabase/supabase-js@2'

type ArchiveEntry = {
  id: string
  title: string
  slug: string
  type?: string
  summary?: string
  classification?: string
  status?: string
  file_no?: string
  is_gated?: boolean
  gated_content?: string
  updated_at?: string
}

type BookerResult = {
  slug: string
  title: string
  entry_type?: string
  classification: string
  status?: string
  file_no?: string
  is_gated?: boolean
  preview: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function normalizeText(value = '') {
  return value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSearchTerms(query: string) {
  return normalizeText(query)
    .split(' ')
    .map((term) => term.trim())
    .filter((term) => term.length > 2 && !STOP_WORDS.has(term))
}

function truncate(value: string, maxLength = 220) {
  if (!value || value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trim()}...`
}

function getPreview(entry: ArchiveEntry, isMember: boolean) {
  const publicPreview = entry.summary || 'No public synopsis is available for this file.'

  if (!entry.is_gated) return publicPreview
  if (isMember && entry.gated_content) return `${publicPreview} Member preview: ${entry.gated_content}`

  return `${publicPreview} Classified sections require member access.`
}

function scoreEntry(entry: ArchiveEntry, terms: string[], normalizedQuery: string) {
  const title = normalizeText(entry.title)
  const slug = normalizeText(entry.slug)
  const type = normalizeText(entry.type)
  const summary = normalizeText(entry.summary)
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
    if (status.includes(term)) score += 2
    if (summary.includes(term)) score += 2
  }

  return score
}

function toBookerResult(entry: ArchiveEntry, isMember: boolean): BookerResult {
  return {
    slug: entry.slug,
    title: entry.title,
    entry_type: entry.type,
    classification: entry.classification ?? 'unclassified',
    status: entry.status,
    file_no: entry.file_no,
    is_gated: entry.is_gated,
    preview: truncate(getPreview(entry, isMember)),
  }
}

function findEntryPreviews(entries: ArchiveEntry[], query: string, isMember: boolean) {
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
  if (wantsRecent) return entries.slice(0, RESULT_LIMIT).map((entry) => toBookerResult(entry, isMember))

  return []
}

function formatRetrievalResponse(query: string, results: BookerResult[], isMember: boolean) {
  if (results.length === 0) {
    return `QUERY RECEIVED. I searched the archive for "${query}". No specific records matched that request. Try an operative name, location designation, event codename, file number, or entry type. ${
      isMember ? 'Member clearance is active.' : 'Public records are limited. Member access unlocks classified previews.'
    }`
  }

  const accessNote = isMember
    ? 'Member clearance active. Classified previews may be included where available.'
    : 'Public preview mode. Classified sections remain sealed.'

  const list = results
    .map((entry, index) => `${index + 1}. ${entry.title} (${entry.entry_type}) - ${entry.preview}`)
    .join('\n')

  return `ARCHIVE MATCHES FOUND FOR "${query}". ${accessNote}\n\n${list}`
}

async function fetchEntries(isMember: boolean) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase function environment variables.')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)
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

  return (data ?? []) as ArchiveEntry[]
}

async function resolveMembership(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')

  if (!authHeader || !supabaseUrl || !anonKey) return false

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })

  const { data } = await supabase.auth.getUser()

  return Boolean(data.user)
}

async function askAnthropic(query: string, results: BookerResult[], isMember: boolean) {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  const model = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-3-5-haiku-latest'

  if (!apiKey || results.length === 0) return null

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 450,
      temperature: 0.4,
      system:
        'You are Booker, the Department of Otherworldly Affairs archive liaison. Answer in a concise, in-world archive terminal voice. Use only the supplied archive previews. Do not invent files, facts, or classified details. If access is public, mention that classified sections remain sealed.',
      messages: [
        {
          role: 'user',
          content: JSON.stringify({
            query,
            access: isMember ? 'member' : 'public',
            archive_previews: results,
          }),
        },
      ],
    }),
  })

  if (!response.ok) return null

  const data = await response.json()
  const text = data?.content?.find((block: { type?: string }) => block.type === 'text')?.text

  return typeof text === 'string' && text.trim() ? text.trim() : null
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await request.json()
    const messages = Array.isArray(body.messages) ? body.messages : []
    const query = messages[messages.length - 1]?.content?.toString() ?? ''
    const isMember = await resolveMembership(request)

    if (!query.trim()) return jsonResponse({ text: 'BOOKER ONLINE. Awaiting archive query.', results: [] })

    const entries = await fetchEntries(isMember)
    const results = findEntryPreviews(entries, query, isMember)
    const aiText = await askAnthropic(query, results, isMember)

    return jsonResponse({
      text: aiText ?? formatRetrievalResponse(query, results, isMember),
      results,
    })
  } catch (error) {
    return jsonResponse(
      {
        text: `BOOKER ARCHIVE LINK FAILURE. ${error instanceof Error ? error.message : 'Unknown function error.'}`,
        results: [],
      },
      500,
    )
  }
})
