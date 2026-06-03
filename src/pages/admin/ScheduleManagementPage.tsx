import { useEffect, useState } from 'react'
import { scheduleService } from '@/services/schedules'
import { venueService } from '@/services/venues'
import { useToast } from '@/components/ui/toast'
import type { Schedule, Venue } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Plus, X, Check, Clock, Calendar, Building2 } from 'lucide-react'

export function ScheduleManagementPage() {
  const { addToast } = useToast()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    venueId: '',
    date: '',
    startTime: '08:00',
    endTime: '09:00',
    available: true,
  })

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchSchedules()
    }
  }, [selectedDate])

  const fetchData = async () => {
    try {
      const [venuesData] = await Promise.all([
        venueService.getVenues(),
      ])
      setVenues(venuesData)
      if (!selectedDate) {
        setSelectedDate(dates[0])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSchedules = async () => {
    try {
      const data = await scheduleService.getSchedules(undefined, selectedDate)
      setSchedules(data)
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await scheduleService.createSchedule({
        ...formData,
        date: selectedDate,
      })
      addToast('Jadwal berhasil ditambahkan', 'success')
      setShowForm(false)
      resetForm()
      fetchSchedules()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal menyimpan', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus jadwal ini?')) return
    try {
      await scheduleService.deleteSchedule(id)
      addToast('Jadwal berhasil dihapus', 'success')
      fetchSchedules()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal menghapus', 'error')
    }
  }

  const handleToggleAvailability = async (schedule: Schedule) => {
    try {
      await scheduleService.updateSchedule(schedule.id, { available: !schedule.available })
      addToast(`Jam ${schedule.startTime} ${schedule.available ? 'ditutup' : 'dibuka'}`, 'success')
      fetchSchedules()
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Gagal update', 'error')
    }
  }

  const resetForm = () => {
    setFormData({ venueId: '', date: selectedDate, startTime: '08:00', endTime: '09:00', available: true })
  }

  const formatSelectedDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  const getDayName = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { weekday: 'short' })
  }

  const getDayNum = (date: string) => {
    return new Date(date).getDate()
  }

  const getMonth = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', { month: 'short' })
  }

  // Group schedules by venue for the selected date
  const schedulesByVenue = venues.map((venue) => ({
    venue,
    schedules: schedules.filter((s) => s.venueId === venue.id),
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kelola Jadwal</h1>
          <p className="text-gray-600 mt-1">Atur ketersediaan jam setiap venue</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Jam
        </Button>
      </div>

      {/* Date Picker - Horizontal Scroll */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-primary" />
            <span className="text-sm font-medium text-gray-600">Pilih Tanggal</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {dates.map((date) => {
              const isSelected = selectedDate === date
              const isToday = date === new Date().toISOString().split('T')[0]
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`relative flex flex-col items-center min-w-[72px] py-3 px-2 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                      : 'bg-white border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  {isToday && !isSelected && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                  <span className={`text-xs font-medium ${isSelected ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                    {getDayName(date)}
                  </span>
                  <span className={`text-xl font-bold ${isSelected ? '' : 'text-gray-900'}`}>
                    {getDayNum(date)}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-gray-400'}`}>
                    {getMonth(date)}
                  </span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Summary */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span>Tersedia</span>
        <div className="w-2 h-2 bg-red-500 rounded-full ml-2" />
        <span>Ditutup</span>
        <span className="ml-auto font-medium">{formatSelectedDate(selectedDate)}</span>
      </div>

      {/* Venue Schedule Cards */}
      <div className="space-y-4">
        {schedulesByVenue.map(({ venue, schedules: venueSchedules }) => {
          const availableCount = venueSchedules.filter((s) => s.available).length
          const totalCount = venueSchedules.length
          const bookedCount = totalCount - availableCount

          return (
            <Card key={venue.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 size={20} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <p className="text-xs text-gray-500 capitalize">{venue.type.replace('-', ' ')} • {venue.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-xs">
                      {availableCount} tersedia
                    </Badge>
                    {bookedCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {bookedCount} ditutup
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {venueSchedules.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Clock size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada jadwal untuk tanggal ini</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setFormData({ ...formData, venueId: venue.id })
                        setShowForm(true)
                      }}
                    >
                      <Plus size={14} className="mr-1" />
                      Tambah Jam
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {venueSchedules
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((schedule) => (
                        <div key={schedule.id} className="group relative">
                          <button
                            onClick={() => handleToggleAvailability(schedule)}
                            className={`w-full py-2.5 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              schedule.available
                                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300'
                                : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300'
                            }`}
                          >
                            <Clock size={12} className="inline mr-1 opacity-70" />
                            {schedule.startTime}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(schedule.id)
                            }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Schedule Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tambah Jam Baru</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X size={16} />
                </Button>
              </div>
              <p className="text-sm text-gray-500">{formatSelectedDate(selectedDate)}</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="venueId">Venue</Label>
                  <Select
                    id="venueId"
                    value={formData.venueId}
                    onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
                    required
                  >
                    <option value="">Pilih Venue</option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Jam Mulai</Label>
                    <Select
                      id="startTime"
                      value={formData.startTime}
                      onChange={(e) => {
                        const start = e.target.value
                        const hour = parseInt(start.split(':')[0])
                        const endTime = `${String(hour + 1).padStart(2, '0')}:00`
                        setFormData({ ...formData, startTime: start, endTime })
                      }}
                      required
                    >
                      {Array.from({ length: 15 }, (_, i) => i + 7).map((hour) => (
                        <option key={hour} value={`${String(hour).padStart(2, '0')}:00`}>
                          {String(hour).padStart(2, '0')}:00
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Jam Selesai</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="flex-1">
                    <Check className="mr-2 h-4 w-4" />
                    Simpan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
