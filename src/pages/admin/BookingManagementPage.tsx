import { useEffect, useState } from 'react'
import { bookingService } from '@/services/bookings'
import { venueService } from '@/services/venues'
import { useToast } from '@/components/ui/toast'
import type { Booking, Venue, BookingStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { Filter } from 'lucide-react'

export function BookingManagementPage() {
  const { addToast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

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

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await bookingService.updateBooking(bookingId, { status: newStatus })
      addToast('Status booking berhasil diupdate', 'success')
      fetchData()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal update', 'error')
    }
  }

  const getVenueById = (id: string) => venues.find((v) => v.id === id)

  const getStatusVariant = (status: Booking['status']) => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Waiting Verification':
        return 'warning'
      case 'Rejected':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const filteredBookings =
    statusFilter === 'all'
      ? bookings
      : bookings.filter((b) => b.status === statusFilter)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kelola Booking</h1>
        <p className="text-gray-600 mt-1">Lihat dan update status semua booking</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span className="text-sm text-gray-600">Filter:</span>
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Semua Status</option>
          <option value="Pending Payment">Pending Payment</option>
          <option value="Waiting Verification">Waiting Verification</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </Select>
        <span className="text-sm text-gray-500">{filteredBookings.length} booking</span>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const venue = getVenueById(booking.venueId)
          return (
            <Card key={booking.id}>
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {venue?.name || 'Venue'} • {booking.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.bookingDate} • {booking.email} • {booking.phoneNumber}
                    </p>
                    {venue && (
                      <p className="text-sm text-gray-500">
                        {formatCurrency(venue.price)} • {venue.city}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">ID: {booking.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                    <div className="flex gap-1">
                      {booking.status === 'Waiting Verification' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleStatusUpdate(booking.id, 'Approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(booking.id, 'Rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {booking.status === 'Approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                        >
                          Selesai
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
