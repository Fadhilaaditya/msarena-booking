import { Outlet, Link } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xs font-bold">
                MS
              </div>
              MS Arena
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                Beranda
              </Link>
              <Link
                to="/admin/login"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2026 MS Arena. All rights reserved.</p>
            <p className="mt-1">Mini Soccer & Futsal Booking Platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
