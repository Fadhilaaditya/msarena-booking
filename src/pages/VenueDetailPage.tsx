import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { venueService } from '@/services/venues'
import { scheduleService } from '@/services/schedules'
import type { Venue, Schedule } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { MapPin, Star, Clock, CheckCircle, ArrowLeft } from 'lucide-react'

export function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split('T')[0]
  })

  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return
      try {
        const data = await venueService.getVenueById(id)
        setVenue(data)
      } catch (error) {
        console.error('Failed to fetch venue:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchVenue()
  }, [id])

  useEffect(() => {
    const fetchSchedules = async () => {
      if (id && selectedDate) {
        try {
          const data = await scheduleService.getSchedules(id, selectedDate)
          setSchedules(data)
        } catch (error) {
          console.error('Failed to fetch schedules:', error)
        }
      }
    }
    fetchSchedules()
  }, [id, selectedDate])

  const handleBookNow = () => {
    if (selectedSchedule) {
      navigate(`/venues/${id}/book?schedule=${selectedSchedule.id}&date=${selectedDate}`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Venue tidak ditemukan</p>
        <Button variant="ghost" onClick={() => navigate('/')} className="mt-4">
          Kembali ke Beranda
        </Button>
      </div>
    )
  }

  const availableSlots = schedules.filter((s) => s.available)
  const bookedSlots = schedules.filter((s) => !s.available)

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
          <img
            src={venue.images[0] || 'https://via.placeholder.com/800x500'}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        </div>
        {venue.images[1] && (
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
            <img
              src={venue.images[1]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Venue Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{venue.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin size={16} />
                      <span>{venue.address}, {venue.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{venue.rating}</span>
                    </div>
                  </div>
                </div>
                <Badge className="capitalize text-sm">{venue.type.replace('-', ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{venue.description}</p>

              <div>
                <h3 className="font-semibold mb-2">Fasilitas</h3>
                <div className="flex flex-wrap gap-2">
                  {venue.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Pilih Jadwal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((date) => {
                  const d = new Date(date)
                  const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' })
                  const dayNum = d.getDate()
                  const monthName = d.toLocaleDateString('id-ID', { month: 'short' })
                  const isFirst = d.getDate() === 1
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedSchedule(null)
                      }}
                      className={`flex flex-col items-center min-w-[50px] p-2 rounded-lg border transition-colors ${
                        selectedDate === date
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {isFirst && <span className="text-[10px] text-gray-500">{monthName}</span>}
                      <span className="text-xs">{dayName}</span>
                      <span className="font-bold">{dayNum}</span>
                    </button>
                  )
                })}
              </div>

              {selectedDate && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Jam Tersedia ({availableSlots.length})
                    </h4>
                    {availableSlots.length === 0 ? (
                      <p className="text-sm text-gray-500">Tidak ada jam tersedia</p>
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() => setSelectedSchedule(slot)}
                            className={`p-2 text-sm rounded-lg border transition-colors ${
                              selectedSchedule?.id === slot.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <Clock size={12} className="inline mr-1" />
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {bookedSlots.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-gray-500">Jam Terbooking ({bookedSlots.length})</h4>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {bookedSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="p-2 text-sm rounded-lg border bg-gray-50 text-gray-400 cursor-not-allowed"
                          >
                            {slot.startTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Ringkasan Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue</span>
                  <span className="font-medium">{venue.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium">{selectedDate || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Waktu</span>
                  <span className="font-medium">
                    {selectedSchedule ? `${selectedSchedule.startTime} - ${selectedSchedule.endTime}` : '-'}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga</span>
                    <span className="font-bold text-primary text-lg">
                      {formatCurrency(venue.price)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!selectedSchedule}
                onClick={handleBookNow}
              >
                Booking Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
