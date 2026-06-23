import { useContext } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { AuthContext } from './context/authContext'
import { router } from './router'
import LoadingScreen from './components/layout/LoadingScreen.jsx'

function AppRoot() {
  const { loading } = useContext(AuthContext)
  if (loading) return <LoadingScreen />
  return <RouterProvider router={router} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  )
}
