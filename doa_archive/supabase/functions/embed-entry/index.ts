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

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const openaiKey = Deno.env.get('OPENAI_API_KEY') ?? ''

  const { entry_id } = await req.json()
  if (!entry_id) return jsonResponse({ error: 'entry_id required' }, 400)

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const { data: entry, error: fetchError } = await supabase
    .from('entries')
    .select('title, type, classification, status, summary, gated_content')
    .eq('id', entry_id)
    .single()

  if (fetchError || !entry) return jsonResponse({ error: 'Entry not found' }, 404)

  const text = [
    entry.title,
    entry.type,
    entry.classification,
    entry.status,
    entry.summary ?? '',
    entry.gated_content ?? '',
  ].filter(Boolean).join(' ')

  const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  })

  if (!embeddingRes.ok) {
    const err = await embeddingRes.text()
    return jsonResponse({ error: `OpenAI error: ${err}` }, 502)
  }

  const embeddingData = await embeddingRes.json()
  const embedding = embeddingData.data[0].embedding

  const { error: updateError } = await supabase
    .from('entries')
    .update({ embedding })
    .eq('id', entry_id)

  if (updateError) return jsonResponse({ error: updateError.message }, 500)

  return jsonResponse({ success: true })
})
