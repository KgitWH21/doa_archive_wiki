import { supabase } from './supabase'

export async function createCheckoutSession() {
  const { data, error } = await supabase.functions.invoke('stripe-checkout', {})
  if (error) throw error
  return data.url
}
