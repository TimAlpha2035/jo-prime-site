import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateAdminRoute() {
  const isAuth = sessionStorage.getItem('admin_auth') === 'true'
  if (!isAuth) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
