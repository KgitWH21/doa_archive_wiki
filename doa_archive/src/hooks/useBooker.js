import { useState } from 'react'
import { sendBookerMessage } from '../lib/anthropic'
import { useAuth } from './useAuth'

const INITIAL_MESSAGE = {
  id: 'init',
  role: 'bot',
  content:
    'Hello and welcome to the wiki! What would you like to know about the novel? Ask away!',
  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
  results: [],
}

export function useBooker() {
  const { isMember } = useAuth()
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await sendBookerMessage([...messages, userMsg], isMember)
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: response.text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        results: response.results,
      }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, sendMessage, isLoading }
}
