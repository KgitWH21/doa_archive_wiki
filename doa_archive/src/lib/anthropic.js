import { supabase } from './supabase'
import { fetchPublishedEntries, findEntryPreviews, formatBookerResponse } from './bookerArchive'

export async function sendBookerMessage(messages, isMember) {
  const lastMessage = messages[messages.length - 1]?.content ?? ''

  try {
    const { data, error } = await supabase.functions.invoke('booker-search', {
      body: { query: lastMessage, isMember },
    })

    if (error) throw error
    if (data?.text) return data
    // fall through to keyword search if no embeddings exist yet
  } catch {
    // fall through to keyword search
  }

  const entries = await fetchPublishedEntries(isMember)
  const results = findEntryPreviews(entries, lastMessage, isMember)
  return {
    text: formatBookerResponse(lastMessage, results, isMember),
    results,
  }
}
