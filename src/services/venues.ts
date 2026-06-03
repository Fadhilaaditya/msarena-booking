import type { Venue } from '@/types'

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

export const venueService = {
  getVenues: async (params?: { q?: string; city?: string; type?: string; minPrice?: number; maxPrice?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.set('q', params.q)
    if (params?.city) searchParams.set('city', params.city)
    if (params?.type) searchParams.set('type', params.type)
    if (params?.minPrice) searchParams.set('minPrice', String(params.minPrice))
    if (params?.maxPrice) searchParams.set('maxPrice', String(params.maxPrice))
    const query = searchParams.toString()
    return apiFetch<Venue[]>(`/venues${query ? `?${query}` : ''}`)
  },

  getVenueById: async (id: string) => {
    return apiFetch<Venue>(`/venues/${id}`)
  },

  createVenue: async (data: Omit<Venue, 'id'>) => {
    return apiFetch<Venue>('/venues', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  updateVenue: async (id: string, data: Partial<Venue>) => {
    return apiFetch<Venue>(`/venues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  deleteVenue: async (id: string) => {
    return apiFetch<{ message: string }>(`/venues/${id}`, {
      method: 'DELETE',
    })
  },
}
