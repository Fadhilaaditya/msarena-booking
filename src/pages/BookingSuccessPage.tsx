import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingService } from '@/services/bookings'
import { venueService } from '@/services/venues'
import type { Booking, Venue } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Copy, Home } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export function BookingSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [venue, setVenue] = useState<Venue | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const bookingData = await bookingService.getBookingById(id)
        if (bookingData) {
          setBooking(bookingData)
          const venueData = await venueService.getVenueById(bookingData.venueId)
          setVenue(venueData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const copyBookingCode = () => {
    if (booking) {
      navigator.clipboard.writeText(booking.id)
      addToast('Kode booking disalin!', 'success')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  if (!booking || !venue) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Data tidak ditemukan</p>
        <Button variant="ghost" onClick={() => navigate('/')} className="mt-4">
          Kembali ke Beranda
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card>
        <CardContent className="py-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">Booking Berhasil!</h1>
            <p className="text-gray-600">
              Booking Anda telah berhasil dibuat. Simpan kode booking di bawah.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Kode Booking</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold font-mono">{booking.id}</p>
              <Button variant="ghost" size="sm" onClick={copyBookingCode}>
                <Copy size={16} />
              </Button>
            </div>
          </div>

          <div className="text-left space-y-3 bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Venue</span>
              <span className="font-medium">{venue.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tanggal</span>
              <span className="font-medium">{booking.bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <Badge variant="secondary">{booking.status}</Badge>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Selanjutnya, silakan lakukan pembayaran dan upload bukti pembayaran.</p>
            <p>Tim kami akan memverifikasi pembayaran Anda.</p>
          </div>

          <Button onClick={() => navigate('/')} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
