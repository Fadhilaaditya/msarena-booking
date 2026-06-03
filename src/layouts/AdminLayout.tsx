import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAdminStore } from '@/store/admin-store'
import { LogOut, LayoutDashboard, Calendar, CreditCard, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sidebarItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Venue', path: '/admin/venues', icon: Building2 },
  { label: 'Jadwal', path: '/admin/schedules', icon: Calendar },
  { label: 'Booking', path: '/admin/bookings', icon: CreditCard },
  { label: 'Verifikasi', path: '/admin/payments', icon: CreditCard },
]

export function AdminLayout() {
  const { admin, logout } = useAdminStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r shadow-sm sticky top-0 h-screen flex flex-col">
        <div className="p-4 border-b">
          <Link to="/admin" className="flex items-center gap-2 font-bold text-lg">
            <LayoutDashboard size={20} />
            MS Arena Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              {admin?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="font-medium truncate">{admin?.email}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
