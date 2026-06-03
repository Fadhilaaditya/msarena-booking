import { http, HttpResponse } from 'msw'
import { database } from './db'
import type { Venue, Booking, Schedule } from '@/types'

const delay = () => new Promise((resolve) => setTimeout(resolve, Math.random() * 300 + 100))

// Admin Auth
const adminLoginHandler = http.post('/api/admin/login', async ({ request }) => {
  await delay()
  const body = (await request.json()) as { email: string; password: string }
  const admin = database.getAdminByEmail(body.email)

  if (!admin || admin.password !== body.password) {
    return HttpResponse.json(
      { message: 'Email atau password salah' },
      { status: 401 }
    )
  }

  const token = `admin-token-${admin.id}-${Date.now()}`
  return HttpResponse.json({ admin: { id: admin.id, email: admin.email, role: admin.role }, token })
})

const adminProfileHandler = http.get('/api/admin/profile', async ({ request }) => {
  await delay()
  const authHeader = request.headers.get('Authorization')
  if (!authHeader) {
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const adminId = token.split('-')[2]
  const admin = database.getAdminById(adminId)

  if (!admin) {
    return HttpResponse.json({ message: 'Admin not found' }, { status: 404 })
  }

  return HttpResponse.json({ id: admin.id, email: admin.email, role: admin.role })
})

// Venues
const getVenuesHandler = http.get('/api/venues', async ({ request }) => {
  await delay()
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''
  const city = url.searchParams.get('city') || undefined
  const type = url.searchParams.get('type') || undefined
  const minPrice = url.searchParams.get('minPrice') ? Number(url.searchParams.get('minPrice')) : undefined
  const maxPrice = url.searchParams.get('maxPrice') ? Number(url.searchParams.get('maxPrice')) : undefined

  const venues = database.searchVenues(query, city, type, minPrice, maxPrice)
  return HttpResponse.json(venues)
})

const getVenueByIdHandler = http.get('/api/venues/:id', async ({ params }) => {
  await delay()
  const { id } = params
  const venue = database.getVenueById(id as string)
  if (!venue) {
    return HttpResponse.json({ message: 'Venue not found' }, { status: 404 })
  }
  return HttpResponse.json(venue)
})

const createVenueHandler = http.post('/api/venues', async ({ request }) => {
  await delay()
  const body = (await request.json()) as Omit<Venue, 'id'>
  const venue = database.createVenue(body)
  return HttpResponse.json(venue, { status: 201 })
})

const updateVenueHandler = http.put('/api/venues/:id', async ({ params, request }) => {
  await delay()
  const { id } = params
  const body = (await request.json()) as Partial<Venue>
  const venue = database.updateVenue(id as string, body)
  if (!venue) {
    return HttpResponse.json({ message: 'Venue not found' }, { status: 404 })
  }
  return HttpResponse.json(venue)
})

const deleteVenueHandler = http.delete('/api/venues/:id', async ({ params }) => {
  await delay()
  const { id } = params
  const success = database.deleteVenue(id as string)
  if (!success) {
    return HttpResponse.json({ message: 'Venue not found' }, { status: 404 })
  }
  return HttpResponse.json({ message: 'Venue deleted' })
})

// Schedules
const getSchedulesHandler = http.get('/api/schedules', async ({ request }) => {
  await delay()
  const url = new URL(request.url)
  const venueId = url.searchParams.get('venueId') || undefined
  const date = url.searchParams.get('date') || undefined
  const schedules = database.getSchedules(venueId, date)
  return HttpResponse.json(schedules)
})

const createScheduleHandler = http.post('/api/schedules', async ({ request }) => {
  await delay()
  const body = (await request.json()) as Omit<Schedule, 'id'>
  const schedule = database.createSchedule(body)
  return HttpResponse.json(schedule, { status: 201 })
})

const updateScheduleHandler = http.put('/api/schedules/:id', async ({ params, request }) => {
  await delay()
  const { id } = params
  const body = (await request.json()) as Partial<Schedule>
  const schedule = database.updateSchedule(id as string, body)
  if (!schedule) {
    return HttpResponse.json({ message: 'Schedule not found' }, { status: 404 })
  }
  return HttpResponse.json(schedule)
})

const deleteScheduleHandler = http.delete('/api/schedules/:id', async ({ params }) => {
  await delay()
  const { id } = params
  const success = database.deleteSchedule(id as string)
  if (!success) {
    return HttpResponse.json({ message: 'Schedule not found' }, { status: 404 })
  }
  return HttpResponse.json({ message: 'Schedule deleted' })
})

// Bookings
const getBookingsHandler = http.get('/api/bookings', async () => {
  await delay()
  const bookings = database.getBookings()
  return HttpResponse.json(bookings)
})

const createBookingHandler = http.post('/api/bookings', async ({ request }) => {
  await delay()
  const body = (await request.json()) as {
    venueId: string
    customerName: string
    email: string
    phoneNumber: string
    bookingDate: string
    scheduleId: string
  }

  // Check schedule availability
  const schedule = database.getScheduleById(body.scheduleId)
  if (!schedule || !schedule.available) {
    return HttpResponse.json(
      { message: 'Jadwal tidak tersedia' },
      { status: 400 }
    )
  }

  const booking = database.createBooking({
    ...body,
    status: 'Pending Payment',
  })

  // Mark schedule as booked
  database.updateSchedule(body.scheduleId, { available: false })

  return HttpResponse.json(booking, { status: 201 })
})

const updateBookingHandler = http.patch('/api/bookings/:id', async ({ params, request }) => {
  await delay()
  const { id } = params
  const body = (await request.json()) as Partial<Booking>
  const booking = database.updateBooking(id as string, body)
  if (!booking) {
    return HttpResponse.json({ message: 'Booking not found' }, { status: 404 })
  }
  return HttpResponse.json(booking)
})

// Payment (upload proof)
const uploadPaymentHandler = http.post('/api/payments', async ({ request }) => {
  await delay()
  const body = (await request.json()) as { bookingId: string; paymentProof: string }

  const booking = database.getBookingById(body.bookingId)
  if (!booking) {
    return HttpResponse.json({ message: 'Booking not found' }, { status: 404 })
  }

  database.updateBooking(body.bookingId, {
    paymentProof: body.paymentProof,
    status: 'Waiting Verification',
  })

  return HttpResponse.json({ message: 'Payment proof uploaded' }, { status: 200 })
})

// Stats
const getStatsHandler = http.get('/api/stats', async () => {
  await delay()
  const stats = database.getStats()
  return HttpResponse.json(stats)
})

export const handlers = [
  adminLoginHandler,
  adminProfileHandler,
  getVenuesHandler,
  getVenueByIdHandler,
  createVenueHandler,
  updateVenueHandler,
  deleteVenueHandler,
  getSchedulesHandler,
  createScheduleHandler,
  updateScheduleHandler,
  deleteScheduleHandler,
  getBookingsHandler,
  createBookingHandler,
  updateBookingHandler,
  uploadPaymentHandler,
  getStatsHandler,
]
