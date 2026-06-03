import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { venueService } from '@/services/venues'
import { scheduleService } from '@/services/schedules'
import { bookingService } from '@/services/bookings'
import { useToast } from '@/components/ui/toast'
import type { Venue, Schedule } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, Calendar, Clock, CreditCard } from 'lucide-react'

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phoneNumber: z.string().min(10, 'Nomor telepon harus minimal 10 digit'),
})

type BookingFormData = z.infer<typeof bookingSchema>

export function BookingPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const scheduleId = searchParams.get('schedule')
  const bookingDate = searchParams.get('date')

  const [venue, setVenue] = useState<Venue | null>(null)
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !scheduleId) return
      try {
        const [venueData, schedulesData] = await Promise.all([
          venueService.getVenueById(id),
          scheduleService.getSchedules(id, bookingDate || undefined),
        ])
        setVenue(venueData)
        const foundSchedule = schedulesData.find((s) => s.id === scheduleId)
        setSchedule(foundSchedule || null)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, scheduleId, bookingDate])

  const onSubmit = async (data: BookingFormData) => {
    if (!venue || !schedule || !id || !scheduleId) return

    setIsSubmitting(true)
    try {
      const booking = await bookingService.createBooking({
        venueId: id,
        customerName: data.customerName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        bookingDate: bookingDate || new Date().toISOString().split('T')[0],
        scheduleId,
      })
      addToast('Booking berhasil dibuat!', 'success')
      navigate(`/booking-success/${booking.id}`)
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal membuat booking', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  if (!venue || !schedule) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Ringkasan Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-40 rounded-lg overflow-hidden">
              <img
                src={venue.images[0] || 'https://via.placeholder.com/400x200'}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{venue.name}</h3>
              <p className="text-sm text-gray-600">{venue.address}, {venue.city}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {bookingDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {schedule.startTime} - {schedule.endTime}
                </span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(venue.price)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pelanggan</CardTitle>
            <CardDescription>Isi data diri Anda untuk melanjutkan booking</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nama Lengkap</Label>
                <Input
                  id="customerName"
                  placeholder="Masukkan nama lengkap"
                  {...register('customerName')}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                <Input
                  id="phoneNumber"
                  placeholder="08xxxxxxxxxx"
                  {...register('phoneNumber')}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Buat Booking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
