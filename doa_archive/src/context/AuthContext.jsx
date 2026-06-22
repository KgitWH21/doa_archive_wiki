import { useState, useEffect } from 'react'
import { AuthContext } from './authContext'
import { supabase } from '../lib/supabase'

async function fetchUserWithProfile(authUser) {
  if (!authUser) return null
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', authUser.id)
    .single()
  return { ...authUser, is_admin: profile?.is_admin ?? false }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(await fetchUserWithProfile(session?.user ?? null))
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(await fetchUserWithProfile(session?.user ?? null))
    })

    return () => subscription.unsubscribe()
  }, [])

  async function register(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isMember = user !== null
  const isAdmin = user?.is_admin === true

  return (
    <AuthContext.Provider value={{ user, isMember, isAdmin, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
