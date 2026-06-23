import { fetchPublishedEntries, findEntryPreviews, formatBookerResponse } from './bookerArchive'

export async function sendBookerMessage(messages, isMember) {
  const lastMessage = messages[messages.length - 1]?.content ?? ''
  const entries = await fetchPublishedEntries(isMember)
  const results = findEntryPreviews(entries, lastMessage, isMember)
  return {
    text: formatBookerResponse(lastMessage, results, isMember),
    results,
  }
}
