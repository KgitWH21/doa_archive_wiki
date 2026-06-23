import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const openaiKey = Deno.env.get('OPENAI_API_KEY')!
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const { query, isMember } = await req.json()

  if (!query?.trim()) return jsonResponse({ text: null, results: [] })

  const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: query }),
  })

  if (!embeddingRes.ok) return jsonResponse({ text: null, results: [] })

  const embeddingData = await embeddingRes.json()
  const queryEmbedding = embeddingData.data[0].embedding

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const { data: matches, error } = await supabase.rpc('match_entries', {
    query_embedding: queryEmbedding,
    match_count: 4,
    filter_published: true,
  })

  if (error || !matches?.length) {
    return jsonResponse({ text: null, results: [] })
  }

  const results = matches.map((entry: {
    slug: string
    title: string
    type: string
    summary: string
    gated_content: string
    is_gated: boolean
  }) => {
    let preview = entry.summary ?? ''
    if (entry.is_gated && !isMember) {
      preview = `${preview} [Classified sections require member access.]`
    } else if (entry.is_gated && isMember && entry.gated_content) {
      preview = `${preview} ${entry.gated_content}`
    }
    if (preview.length > 220) preview = `${preview.slice(0, 220).trim()}...`
    return {
      slug: entry.slug,
      title: entry.title,
      entry_type: entry.type,
      preview,
    }
  })

  const accessNote = isMember
    ? 'Member clearance active.'
    : 'Sign in and unlock access for classified previews.'

  const text = `ARCHIVE SEARCH COMPLETE. Found ${results.length} record(s) matching your query. ${accessNote}`

  return jsonResponse({ text, results })
})
