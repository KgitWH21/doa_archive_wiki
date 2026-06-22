import { useState, useEffect } from 'react'
import { AuthContext } from './authContext'

const MOCK_USERS = {
  member: { id: 'mock-member', email: 'operative@doa.gov', is_admin: false },
  admin: { id: 'mock-admin', email: 'admin@doa.gov', is_admin: true },
}

// Dev console toggle: window.__DOA_USER__ = 'member' | 'admin' | null
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const desired = window.__DOA_USER__
      if (desired === undefined) return
      if (desired === null || desired === 'guest') {
        setUser(null)
      } else if (MOCK_USERS[desired]) {
        setUser(MOCK_USERS[desired])
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])

  function login(email) {
    const role = email.includes('admin') ? 'admin' : 'member'
    setUser(MOCK_USERS[role])
    return Promise.resolve({ user: MOCK_USERS[role] })
  }

  function logout() {
    setUser(null)
    return Promise.resolve()
  }

  function register() {
    setUser(MOCK_USERS.member)
    return Promise.resolve({ user: MOCK_USERS.member })
  }

  const isMember = user !== null
  const isAdmin = user?.is_admin === true

  return (
    <AuthContext.Provider value={{ user, isMember, isAdmin, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}
