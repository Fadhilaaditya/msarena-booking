import { create } from 'zustand'
import type { AdminUser } from '@/services'

interface AdminState {
  admin: AdminUser | null
  token: string | null
  isAuthenticated: boolean
  login: (admin: AdminUser, token: string) => void
  logout: () => void
  initialize: () => void
}

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  token: null,
  isAuthenticated: false,
  login: (admin, token) => {
    localStorage.setItem('admin_token', token)
    localStorage.setItem('admin', JSON.stringify(admin))
    set({ admin, token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin')
    set({ admin: null, token: null, isAuthenticated: false })
  },
  initialize: () => {
    const token = localStorage.getItem('admin_token')
    const adminStr = localStorage.getItem('admin')
    if (token && adminStr) {
      try {
        const admin = JSON.parse(adminStr) as AdminUser
        set({ admin, token, isAuthenticated: true })
      } catch {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin')
      }
    }
  },
}))
