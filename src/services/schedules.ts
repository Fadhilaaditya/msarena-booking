import type { Schedule } from '@/types'

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

export const scheduleService = {
  getSchedules: async (venueId?: string, date?: string) => {
    const params = new URLSearchParams()
    if (venueId) params.set('venueId', venueId)
    if (date) params.set('date', date)
    const query = params.toString()
    return apiFetch<Schedule[]>(`/schedules${query ? `?${query}` : ''}`)
  },

  createSchedule: async (data: Omit<Schedule, 'id'>) => {
    return apiFetch<Schedule>('/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateSchedule: async (id: string, data: Partial<Schedule>) => {
    return apiFetch<Schedule>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteSchedule: async (id: string) => {
    return apiFetch<{ message: string }>(`/schedules/${id}`, {
      method: 'DELETE',
    })
  },
}
