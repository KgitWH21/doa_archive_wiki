import { useState, useEffect } from 'react'
import { AuthContext } from './authContext'
import { supabase } from '../lib/supabase'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  async function register(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user.id)
      .single()
    setUser({ ...data.user, is_admin: profile?.is_admin ?? false })
    return data
  }

  function logout() {
    // replaced in next step
    setUser(null)
    return Promise.resolve()
  }

  const isMember = user !== null
  const isAdmin = user?.is_admin === true

  return (
    <AuthContext.Provider value={{ user, isMember, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
