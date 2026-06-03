import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { HomePage } from '@/pages/HomePage'
import { VenueDetailPage } from '@/pages/VenueDetailPage'
import { BookingPage } from '@/pages/BookingPage'
import { BookingSuccessPage } from '@/pages/BookingSuccessPage'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { VenueManagementPage } from '@/pages/admin/VenueManagementPage'
import { ScheduleManagementPage } from '@/pages/admin/ScheduleManagementPage'
import { BookingManagementPage } from '@/pages/admin/BookingManagementPage'
import { PaymentVerificationPage } from '@/pages/admin/PaymentVerificationPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'venues/:id', element: <VenueDetailPage /> },
      { path: 'venues/:id/book', element: <BookingPage /> },
      { path: 'booking-success/:id', element: <BookingSuccessPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: 'venues', element: <VenueManagementPage /> },
          { path: 'schedules', element: <ScheduleManagementPage /> },
          { path: 'bookings', element: <BookingManagementPage /> },
          { path: 'payments', element: <PaymentVerificationPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
