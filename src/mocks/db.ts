import type { Venue, Schedule, Booking, Admin } from '@/types'
import { generateId } from '@/lib/utils'

interface Database {
  admins: Admin[]
  venues: Venue[]
  schedules: Schedule[]
  bookings: Booking[]
}

const seedAdmins: Admin[] = [
  {
    id: 'admin-001',
    email: 'admin@msarena.com',
    password: 'Admin123!',
    role: 'admin',
  },
]

const placeholderImages = [
  'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=500&fit=crop',
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=500&fit=crop',
]

const seedVenues: Venue[] = [
  {
    id: 'venue-001',
    name: 'Gor Futsal Sentra Olahraga',
    city: 'Jakarta Selatan',
    address: 'Jl. Rajawali Timur No.8, Kebayoran Baru',
    type: 'futsal',
    price: 150000,
    rating: 4.8,
    description: 'Gor futsal premium dengan fasilitas lengkap. Lapangan sintetis FIFA quality pro, lighting standar pertandingan, dan ruang ganti yang nyaman.',
    images: [placeholderImages[0], placeholderImages[1]],
    facilities: ['Lapangan Sintetis', 'Ruang Ganti', 'Parkir Luas', 'Kantin', 'Mushola', 'Wi-Fi'],
  },
  {
    id: 'venue-002',
    name: 'Arena Futsal Jakarta',
    city: 'Jakarta Timur',
    address: 'Jl. Pemuda No.20, Rawamangun',
    type: 'futsal',
    price: 125000,
    rating: 4.5,
    description: 'Futsal arena dengan suasana nyaman dan harga terjangkau. Cocok untuk latihan rutin dan pertandingan persahabatan.',
    images: [placeholderImages[2], placeholderImages[3]],
    facilities: ['Lapangan Vinyl', 'Ruang Ganti', 'Parkir', 'Kantin'],
  },
  {
    id: 'venue-003',
    name: 'Mini Soccer Arena Kota',
    city: 'Jakarta Pusat',
    address: 'Jl. Gatot Subroto No.14, Karet Tengsin',
    type: 'mini-soccer',
    price: 250000,
    rating: 4.9,
    description: 'Mini soccer arena premium di pusat kota. Lapangan rumput sintetis terbaik dengan pencahayaan LED modern.',
    images: [placeholderImages[0], placeholderImages[2]],
    facilities: ['Lapangan Rumput Sintetis', 'LED Lighting', 'Ruang Ganti VIP', 'Parkir Valet', 'Kafe', 'Mushola', 'Wi-Fi'],
  },
  {
    id: 'venue-004',
    name: 'Main Bareng Mini Soccer',
    city: 'Bandung',
    address: 'Jl. Dago No.45, Coblong',
    type: 'mini-soccer',
    price: 200000,
    rating: 4.7,
    description: 'Tempat main mini soccer favorit di Bandung. Suasana asri dengan pemandangan pegunungan.',
    images: [placeholderImages[1], placeholderImages[3]],
    facilities: ['Lapangan Rumput', 'Gazebo', 'Parkir', 'Warung', 'Mushola'],
  },
  {
    id: 'venue-005',
    name: 'Futsal Gembira',
    city: 'Surabaya',
    address: 'Jl. Pemuda No.100, Genteng',
    type: 'futsal',
    price: 100000,
    rating: 4.3,
    description: 'Futsal murah meriah di jantung Surabaya. Cocok untuk kumpul bareng teman-teman.',
    images: [placeholderImages[2], placeholderImages[0]],
    facilities: ['Lapangan Karpet', 'Ruang Ganti', 'Parkir Motor'],
  },
  {
    id: 'venue-006',
    name: 'Green Field Mini Soccer',
    city: 'Jakarta Selatan',
    address: 'Jl. Melawai Raya No.12, Kebayoran Baru',
    type: 'mini-soccer',
    price: 300000,
    rating: 4.6,
    description: 'Mini soccer field premium dengan rumput terbaik. Tersedia 3 lapangan ukuran standar.',
    images: [placeholderImages[3], placeholderImages[1]],
    facilities: ['3 Lapangan', 'Rumput FIFA Quality', 'Ruang Ganti', 'Parkir Underground', 'Restoran', 'Gym'],
  },
]

const generateSchedules = (): Schedule[] => {
  const schedules: Schedule[] = []
  const dates = ['2026-06-04', '2026-06-05', '2026-06-06', '2026-06-07', '2026-06-08']
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

  for (const venue of seedVenues) {
    for (const date of dates) {
      for (const startTime of timeSlots) {
        const hour = parseInt(startTime.split(':')[0])
        const endTime = `${String(hour + 1).padStart(2, '0')}:00`
        schedules.push({
          id: generateId(),
          venueId: venue.id,
          date,
          startTime,
          endTime,
          available: Math.random() > 0.3,
        })
      }
    }
  }
  return schedules
}

const seedBookings: Booking[] = [
  {
    id: 'BK-001',
    venueId: 'venue-001',
    customerName: 'Budi Santoso',
    email: 'budi@email.com',
    phoneNumber: '081234567890',
    bookingDate: '2026-06-04',
    scheduleId: '',
    paymentProof: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'Waiting Verification',
  },
  {
    id: 'BK-002',
    venueId: 'venue-003',
    customerName: 'Andi Wijaya',
    email: 'andi@email.com',
    phoneNumber: '085678901234',
    bookingDate: '2026-06-05',
    scheduleId: '',
    status: 'Pending Payment',
  },
]

const db: Database = {
  admins: [...seedAdmins],
  venues: [...seedVenues],
  schedules: generateSchedules(),
  bookings: [...seedBookings],
}

export const database = {
  // Admins
  getAdminByEmail: (email: string) => db.admins.find((a) => a.email === email),
  getAdminById: (id: string) => db.admins.find((a) => a.id === id),

  // Venues
  getVenues: () => db.venues,
  getVenueById: (id: string) => db.venues.find((v) => v.id === id),
  searchVenues: (query: string, city?: string, type?: string, minPrice?: number, maxPrice?: number) => {
    return db.venues.filter((v) => {
      if (query && !v.name.toLowerCase().includes(query.toLowerCase()) && !v.city.toLowerCase().includes(query.toLowerCase()) && !v.address.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      if (city && v.city !== city) return false
      if (type && v.type !== type) return false
      if (minPrice && v.price < minPrice) return false
      if (maxPrice && v.price > maxPrice) return false
      return true
    })
  },
  createVenue: (venue: Omit<Venue, 'id'>) => {
    const newVenue = { ...venue, id: generateId() }
    db.venues.push(newVenue)
    return newVenue
  },
  updateVenue: (id: string, data: Partial<Venue>) => {
    const index = db.venues.findIndex((v) => v.id === id)
    if (index !== -1) {
      db.venues[index] = { ...db.venues[index], ...data }
      return db.venues[index]
    }
    return null
  },
  deleteVenue: (id: string) => {
    const index = db.venues.findIndex((v) => v.id === id)
    if (index !== -1) {
      db.venues.splice(index, 1)
      return true
    }
    return false
  },

  // Schedules
  getSchedules: (venueId?: string, date?: string) => {
    return db.schedules.filter((s) => {
      if (venueId && s.venueId !== venueId) return false
      if (date && s.date !== date) return false
      return true
    })
  },
  getScheduleById: (id: string) => db.schedules.find((s) => s.id === id),
  createSchedule: (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule = { ...schedule, id: generateId() }
    db.schedules.push(newSchedule)
    return newSchedule
  },
  updateSchedule: (id: string, data: Partial<Schedule>) => {
    const index = db.schedules.findIndex((s) => s.id === id)
    if (index !== -1) {
      db.schedules[index] = { ...db.schedules[index], ...data }
      return db.schedules[index]
    }
    return null
  },
  deleteSchedule: (id: string) => {
    const index = db.schedules.findIndex((s) => s.id === id)
    if (index !== -1) {
      db.schedules.splice(index, 1)
      return true
    }
    return false
  },

  // Bookings
  getBookings: () => db.bookings,
  getBookingById: (id: string) => db.bookings.find((b) => b.id === id),
  createBooking: (booking: Omit<Booking, 'id'>) => {
    const newBooking = { ...booking, id: `BK-${generateId().substring(0, 6).toUpperCase()}` }
    db.bookings.push(newBooking)
    return newBooking
  },
  updateBooking: (id: string, data: Partial<Booking>) => {
    const index = db.bookings.findIndex((b) => b.id === id)
    if (index !== -1) {
      db.bookings[index] = { ...db.bookings[index], ...data }
      return db.bookings[index]
    }
    return null
  },

  // Stats
  getStats: () => ({
    totalVenues: db.venues.length,
    totalBookings: db.bookings.length,
    pendingVerifications: db.bookings.filter((b) => b.status === 'Waiting Verification').length,
    approvedBookings: db.bookings.filter((b) => b.status === 'Approved').length,
  }),
}
