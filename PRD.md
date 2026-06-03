# Product Requirements Document (PRD)

# Mini Soccer & Futsal Field Booking Platform

Version: 1.0

Status: Draft

---

# 1. Executive Summary

The Mini Soccer & Futsal Field Booking Platform is a web-based application that allows visitors to browse sports venues, check field availability, and make reservations online without requiring account registration or user authentication.

The platform adopts a marketplace-style experience similar to modern sports booking applications where users can immediately access venue information, compare prices, view schedules, and complete bookings.

The application will be developed as a frontend-only project using React and Vite, while API communication will be simulated using Mock Service Worker (MSW). This approach eliminates the need for a backend service while maintaining a realistic development experience.

---

# 2. Project Goals

## Business Goals

* Simplify venue discovery and booking.
* Reduce manual reservation processes.
* Provide schedule visibility for customers.
* Improve booking management efficiency.

## Technical Goals

* Build a responsive modern web application.
* Simulate production-ready APIs using MSW.
* Implement reusable UI architecture.
* Support software testing activities including:

  * Black Box Testing
  * White Box Testing
  * User Acceptance Testing (UAT)
  * Regression Testing
  * Object-Oriented Testing

---

# 3. Target Users

## Visitors

Individuals searching for futsal or mini soccer fields.

Characteristics:

* No account required.
* Want quick booking process.
* Need schedule visibility.
* Compare venues before booking.

## Administrators

Venue management staff responsible for:

* Managing venues.
* Managing schedules.
* Reviewing bookings.
* Verifying payments.

---

# 4. Technology Stack

## Frontend

* React 19
* Vite
* TypeScript
* React Router DOM

## Styling

* Tailwind CSS
* shadcn/ui
* Lucide Icons

## State Management

* Zustand

## Data Fetching

* TanStack Query

## Form Handling

* React Hook Form
* Zod

## Mock Backend

* Mock Service Worker (MSW)

## Data Persistence

* Local Storage
* Mock Database

---

# 5. User Roles

## Public Visitor

Permissions:

* Browse venues
* Search venues
* Filter venues
* View venue details
* View schedules
* Create bookings
* Upload payment proof

No authentication required.

---

## Administrator

Permissions:

* Login
* Manage venues
* Manage schedules
* Manage bookings
* Verify payments
* Update booking status

---

# 6. Demo Credentials

## Administrator

Email:

[admin@msarena.com](mailto:admin@msarena.com)

Password:

Admin123!

Role:

Admin

---

# 7. User Journey

## Visitor Journey

Homepage

↓

Browse Venue Listings

↓

Search / Filter Venue

↓

Open Venue Detail

↓

Select Date

↓

Choose Available Schedule

↓

Fill Booking Form

↓

Upload Payment Proof

↓

Booking Submitted

↓

Waiting Verification

---

## Administrator Journey

Admin Login

↓

Dashboard

↓

Review Booking

↓

Verify Payment

↓

Approve / Reject Booking

---

# 8. Functional Requirements

## FR-01 Venue Listing

Users can browse all available venues.

### Acceptance Criteria

* Display venue image.
* Display venue name.
* Display location.
* Display field type.
* Display rating.
* Display starting price.

---

## FR-02 Venue Search

Users can search venues by:

* Venue name
* City
* Location

### Acceptance Criteria

* Search results update immediately.
* No page refresh required.

---

## FR-03 Venue Filtering

Users can filter venues by:

* Field type
* City
* Price range

### Acceptance Criteria

* Multiple filters can be applied simultaneously.
* Results update dynamically.

---

## FR-04 Venue Details

Users can view detailed venue information.

### Information Displayed

* Venue gallery
* Venue description
* Address
* Facilities
* Pricing
* Available schedules

---

## FR-05 Schedule Viewing

Users can view available booking slots.

### Schedule Status

* Available
* Booked

---

## FR-06 Booking Creation

Users can create bookings.

### Required Information

* Full Name
* Email
* Phone Number
* Booking Date
* Time Slot

### Validation Rules

* All fields required.
* Email format valid.
* Phone number required.
* Schedule must be available.

---

## FR-07 Payment Submission

Users can upload payment proof.

### Supported Formats

* JPG
* JPEG
* PNG

### Maximum Size

5 MB

### Result

Booking status changes to:

Waiting Verification

---

## FR-08 Admin Authentication

Administrators can log in using predefined credentials.

### Validation

* Email required.
* Password required.
* Credentials must match demo account.

---

## FR-09 Venue Management

Administrators can:

* Create venue
* Edit venue
* Delete venue

---

## FR-10 Schedule Management

Administrators can:

* Create schedules
* Edit schedules
* Disable schedules

---

## FR-11 Booking Management

Administrators can:

* View bookings
* Filter bookings
* Approve bookings
* Reject bookings

---

# 9. Application Pages

## Public Pages

### Home Page

Components:

* Navigation Bar
* Hero Section
* Search Bar
* Filter Section
* Venue Grid
* Footer

---

### Venue Detail Page

Components:

* Image Gallery
* Venue Information
* Pricing Information
* Schedule Availability
* Booking Button

---

### Booking Page

Components:

* Booking Summary
* Customer Form
* Schedule Selection
* Payment Information

---

### Booking Success Page

Components:

* Booking Code
* Venue Information
* Payment Status

---

## Admin Pages

### Login Page

### Dashboard

### Venue Management

### Schedule Management

### Booking Management

### Payment Verification

---

# 10. Data Models

## Venue

```typescript
export interface Venue {
  id: string
  name: string
  city: string
  address: string
  type: "futsal" | "mini-soccer"
  price: number
  rating: number
  description: string
  images: string[]
  facilities: string[]
}
```

## Schedule

```typescript
export interface Schedule {
  id: string
  venueId: string
  date: string
  startTime: string
  endTime: string
  available: boolean
}
```

## Booking

```typescript
export interface Booking {
  id: string
  venueId: string
  customerName: string
  email: string
  phoneNumber: string
  bookingDate: string
  scheduleId: string
  paymentProof?: string
  status:
    | "Pending Payment"
    | "Waiting Verification"
    | "Approved"
    | "Rejected"
}
```

## Admin

```typescript
export interface Admin {
  id: string
  email: string
  password: string
  role: "admin"
}
```

---

# 11. Booking Status Flow

```text
Pending Payment
        ↓
Waiting Verification
        ↓
Approved
```

Alternative:

```text
Pending Payment
        ↓
Waiting Verification
        ↓
Rejected
```

---

# 12. Mock API Specification

## Venue Endpoints

GET /api/venues

GET /api/venues/:id

POST /api/venues

PUT /api/venues/:id

DELETE /api/venues/:id

---

## Schedule Endpoints

GET /api/schedules

POST /api/schedules

PUT /api/schedules/:id

DELETE /api/schedules/:id

---

## Booking Endpoints

GET /api/bookings

POST /api/bookings

PATCH /api/bookings/:id

---

## Payment Endpoints

POST /api/payments

---

## Admin Endpoints

POST /api/admin/login

GET /api/admin/profile

---

# 13. Non-Functional Requirements

## Performance

* Initial page load under 3 seconds.
* Search response under 500ms.
* Filter response under 500ms.

## Responsiveness

Supported Devices:

* Desktop
* Tablet
* Mobile

## Accessibility

* Semantic HTML.
* Keyboard navigation support.
* Accessible form controls.

## Maintainability

* Feature-based folder structure.
* Reusable UI components.
* Type-safe architecture using TypeScript.

---

# 14. Suggested Folder Structure

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── venue/
│   ├── booking/
│   └── layout/
├── features/
│   ├── venues/
│   ├── booking/
│   ├── schedules/
│   └── admin/
├── pages/
├── routes/
├── services/
├── store/
├── hooks/
├── types/
├── mocks/
│   ├── browser.ts
│   ├── handlers.ts
│   ├── db.ts
│   └── seed.ts
├── lib/
└── assets/
```

---

# 15. Testing Scope

## Black Box Testing

* Venue Search
* Venue Filter
* Venue Detail
* Booking Form
* Payment Upload
* Admin Login

## White Box Testing

* Booking validation flow
* Payment verification flow

## UAT

* Venue discovery process
* Booking process
* Payment submission process

## Regression Testing

* Search functionality
* Booking functionality
* Admin management functionality

---

# 16. Success Criteria

The system will be considered successful when:

* Visitors can browse venues without authentication.
* Venue search functions correctly.
* Venue filtering functions correctly.
* Venue details display properly.
* Booking creation works successfully.
* Payment proof upload works successfully.
* Administrators can manage venues and bookings.
* All planned testing scenarios pass.
* UAT score reaches at least 80%.
* The application functions entirely using MSW without requiring a backend.

---
