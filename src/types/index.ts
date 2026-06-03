export interface Venue {
  id: string
  name: string
  city: string
  address: string
  type: 'futsal' | 'mini-soccer'
  price: number
  rating: number
  description: string
  images: string[]
  facilities: string[]
}

export interface Schedule {
  id: string
  venueId: string
  date: string
  startTime: string
  endTime: string
  available: boolean
}

export interface Booking {
  id: string
  venueId: string
  customerName: string
  email: string
  phoneNumber: string
  bookingDate: string
  scheduleId: string
  paymentProof?: string
  status: 'Pending Payment' | 'Waiting Verification' | 'Approved' | 'Rejected'
}

export interface Admin {
  id: string
  email: string
  password: string
  role: 'admin'
}

export type BookingStatus = Booking['status']
