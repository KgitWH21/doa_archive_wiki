import {
  fetchPublishedEntries,
  findEntryPreviews,
  formatBookerResponse,
} from './bookerArchive'
import { supabase } from './supabase'

async function sendBookerFallback(lastMessage, isMember) {
  const entries = await fetchPublishedEntries(isMember)
  const results = findEntryPreviews(entries, lastMessage, isMember)

  return {
    text: formatBookerResponse(lastMessage, results, isMember),
    results,
  }
}

export async function sendBookerMessage(messages, isMember) {
  const lastMessage = messages[messages.length - 1]?.content ?? ''

  try {
    const { data, error } = await supabase.functions.invoke('booker-chat', {
      body: { messages, isMember },
    })

    if (error) throw error
    if (data?.text) return data

    return sendBookerFallback(lastMessage, isMember)
  } catch (error) {
    try {
      return await sendBookerFallback(lastMessage, isMember)
    } catch (fallbackError) {
      return {
        text: `BOOKER ARCHIVE LINK FAILURE. I could not read the entry index for "${lastMessage}". ${
          fallbackError.message ?? error.message ?? 'Check the archive data connection and retry.'
        }`,
        results: [],
      }
    }
  }
}
