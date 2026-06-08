import { useEffect, useState } from 'react'
import { bookingService } from '@/services/bookings'
import { venueService } from '@/services/venues'
import { useToast } from '@/components/ui/toast'
import type { Booking, Venue } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Eye, X } from 'lucide-react'

export function PaymentVerificationPage() {
  const { addToast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const fetchData = async () => {
    try {
      const [bookingsData, venuesData] = await Promise.all([
        bookingService.getBookings(),
        venueService.getVenues(),
      ])
      setBookings(bookingsData)
      setVenues(venuesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [])

  const handleVerify = async (bookingId: string, status: 'Approved' | 'Rejected') => {
    try {
      await bookingService.updateBooking(bookingId, { status })
      addToast(
        status === 'Approved' ? 'Pembayaran disetujui' : 'Pembayaran ditolak',
        status === 'Approved' ? 'success' : 'info'
      )
      setSelectedBooking(null)
      fetchData()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal verifikasi', 'error')
    }
  }

  const getVenueById = (id: string) => venues.find((v) => v.id === id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  const pendingBookings = bookings.filter(
    (b) => b.status === 'Waiting Verification' && b.paymentProof
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verifikasi Pembayaran</h1>
        <p className="text-gray-600 mt-1">Tinjau bukti pembayaran yang masuk</p>
      </div>

      {pendingBookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Tidak ada pembayaran yang perlu diverifikasi
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((booking) => {
            const venue = getVenueById(booking.venueId)
            return (
              <Card key={booking.id}>
                <CardContent className="py-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium">{venue?.name || 'Venue'} • {booking.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {booking.bookingDate} • {booking.email} • {booking.phoneNumber}
                      </p>
                      <p className="text-xs text-gray-400">ID: {booking.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">Menunggu Verifikasi</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleVerify(booking.id, 'Approved')}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Setuju
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleVerify(booking.id, 'Rejected')}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bukti Pembayaran</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedBooking.paymentProof && (
                <img
                  src={selectedBooking.paymentProof}
                  alt="Bukti pembayaran"
                  className="w-full rounded-lg border"
                />
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pelanggan</span>
                  <span className="font-medium">{selectedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span>{selectedBooking.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Telepon</span>
                  <span>{selectedBooking.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal</span>
                  <span>{selectedBooking.bookingDate}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handleVerify(selectedBooking.id, 'Approved')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Setuju
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleVerify(selectedBooking.id, 'Rejected')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Tolak
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
