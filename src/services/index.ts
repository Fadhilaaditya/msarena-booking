const API_BASE = '/api'

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
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

export interface AdminUser {
  id: string
  email: string
  role: 'admin'
}

export const adminService = {
  login: async (email: string, password: string) => {
    return apiFetch<{ admin: AdminUser; token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  getProfile: async () => {
    return apiFetch<AdminUser>('/admin/profile')
  },
}

export interface Stats {
  totalVenues: number
  totalBookings: number
  pendingVerifications: number
  approvedBookings: number
}

export const statsService = {
  getStats: async () => {
    return apiFetch<Stats>('/stats')
  },
}

export { venueService } from './venues'
export { scheduleService } from './schedules'
export { bookingService } from './bookings'
