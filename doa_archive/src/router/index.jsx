import { createBrowserRouter } from 'react-router-dom'
import { AdminRoute } from './AdminRoute'
import { HomePage } from '../pages/HomePage'
import { EntryPage } from '../pages/EntryPage'
import { BookerPage } from '../pages/BookerPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { AdminPage } from '../pages/AdminPage'
import { AdminEntryPage } from '../pages/AdminEntryPage'
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/entry/:slug', element: <EntryPage /> },
  { path: '/booker', element: <BookerPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/entry/new',
    element: (
      <AdminRoute>
        <AdminEntryPage />
      </AdminRoute>
    ),
  },
  {
    path: '/admin/entry/:id/edit',
    element: (
      <AdminRoute>
        <AdminEntryPage />
      </AdminRoute>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
])
