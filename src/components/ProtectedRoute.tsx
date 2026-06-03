import { Outlet, Navigate } from 'react-router-dom'
import { useAdminStore } from '@/store/admin-store'

export function ProtectedRoute() {
  const { isAuthenticated } = useAdminStore()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
