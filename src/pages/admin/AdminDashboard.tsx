import { useEffect, useState } from 'react'
import { statsService, type Stats } from '@/services'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, CreditCard, Clock, CheckCircle } from 'lucide-react'

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">Ringkasan sistem booking venue</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Venue</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVenues || 0}</div>
            <CardDescription className="text-xs">Venue terdaftar</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Booking</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
            <CardDescription className="text-xs">Semua booking</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Verifikasi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats?.pendingVerifications || 0}
            </div>
            <CardDescription className="text-xs">Perlu ditindak</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.approvedBookings || 0}
            </div>
            <CardDescription className="text-xs">Booking aktif</CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <a
              href="/admin/payments"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">Verifikasi Pembayaran</p>
              <p className="text-sm text-gray-500">Tinjau bukti pembayaran yang masuk</p>
            </a>
            <a
              href="/admin/venues"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">Kelola Venue</p>
              <p className="text-sm text-gray-500">Tambah, edit, atau hapus venue</p>
            </a>
            <a
              href="/admin/bookings"
              className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">Kelola Booking</p>
              <p className="text-sm text-gray-500">Lihat dan update status booking</p>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Sistem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Versi Aplikasi</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Status Mock API</span>
              <span className="font-medium text-green-600">Aktif</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Database</span>
              <span className="font-medium">In-Memory</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
