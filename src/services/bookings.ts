import type { Booking } from '@/types'

const API_BASE = '/api'

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Terjadi kesalahan' }))
    throw new Error(error.message || 'Terjadi kesalahan')
  }

  return response.json()
}

export const bookingService = {
  getBookings: async () => {
    return apiFetch<Booking[]>('/bookings')
  },

  getBookingById: async (id: string) => {
    const bookings = await apiFetch<Booking[]>('/bookings')
    return bookings.find((b) => b.id === id)
  },

  createBooking: async (data: {
    venueId: string
    customerName: string
    email: string
    phoneNumber: string
    bookingDate: string
    scheduleId: string
  }) => {
    return apiFetch<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateBooking: async (id: string, data: Partial<Booking>) => {
    return apiFetch<Booking>(`/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  uploadPayment: async (bookingId: string, paymentProof: string) => {
    return apiFetch<{ message: string }>('/payments', {
      method: 'POST',
      body: JSON.stringify({ bookingId, paymentProof }),
    })
  },
}
