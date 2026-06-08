import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingService } from '@/services/bookings'
import { venueService } from '@/services/venues'
import type { Booking, Venue } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Copy, Home, Upload, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

export function BookingSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [venue, setVenue] = useState<Venue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentProof, setPaymentProof] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return
      try {
        const bookingData = await bookingService.getBookingById(id)
        if (bookingData) {
          setBooking(bookingData)
          setPaymentProof(bookingData.paymentProof || null)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      addToast('Ukuran file maksimal 5MB', 'error')
      return
    }

    if (!file.type.startsWith('image/')) {
      addToast('File harus berupa gambar', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPaymentProof(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!booking || !paymentProof) return

    setIsUploading(true)
    try {
      await bookingService.uploadPayment(booking.id, paymentProof)
      setBooking({ ...booking, status: 'Waiting Verification', paymentProof })
      addToast('Bukti pembayaran berhasil diupload!', 'success')
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal upload bukti pembayaran', 'error')
    } finally {
      setIsUploading(false)
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

          <Button onClick={() => navigate('/')} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>

      {booking.status === 'Pending Payment' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload size={20} />
              Upload Bukti Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload bukti transfer/screenshot pembayaran Anda.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {paymentProof ? (
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden border">
                  <img
                    src={paymentProof}
                    alt="Bukti pembayaran"
                    className="w-full h-48 object-contain bg-gray-50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Ganti Foto
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isUploading ? 'Mengupload...' : 'Upload'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full h-32 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Klik untuk memilih gambar</p>
                  <p className="text-xs text-gray-400">JPG, PNG (maks. 5MB)</p>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {booking.status === 'Waiting Verification' && (
        <Card>
          <CardContent className="py-6 text-center">
            <Badge variant="secondary" className="mb-2">Menunggu Verifikasi</Badge>
            <p className="text-sm text-gray-600">
              Bukti pembayaran Anda sedang diverifikasi oleh admin.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
