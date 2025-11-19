# Rental Car Booking System

A backend system for managing car rental bookings, built with Node.js, Express, and MongoDB.

## Features

### User Management

- **Register:** Users can register with name, email, telephone, and password.
- **Login:** Secure login using JWT (JSON Web Tokens).
- **Roles:**
  - **User:** Can book cars, view/edit/delete their own bookings.
  - **Admin:** Can manage car providers and view/edit/delete any booking.

### Car Providers

- Manage rental car providers (Name, Address, Telephone).
- **Public:** View all car providers.
- **Admin:** Create, Update, and Delete car providers.

### Bookings

- **Booking Limit:** Regular users can make up to **3 bookings**.
- **Create:** Users can book a car from a specific provider for a specific date.
- **View:** Users see their own bookings; Admins see all bookings.
- **Update/Delete:** Users manage their own; Admins manage all.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT & Cookies

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB connection string

### Installation

1. Clone the repository.
2. Navigate to the `api` directory:
   `ash
cd api
`
3. Install dependencies:
   `ash
npm install
`
4. Create a `config/config.env` file (use `config/config.env.example` as a template) and add your MongoDB URI:
   `env
PORT=5000
NODE_ENV=development
MONGO_URI=<your_mongodb_uri>
JWT_SECRET=<your_secret>
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
`
5. Run the server:
   `ash
npm run dev
`

## API Endpoints

### Auth

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/logout` - Logout user

### Car Providers

- `GET /api/v1/carproviders` - Get all providers
- `GET /api/v1/carproviders/:id` - Get single provider
- `POST /api/v1/carproviders` - Create provider (Admin only)
- `PUT /api/v1/carproviders/:id` - Update provider (Admin only)
- `DELETE /api/v1/carproviders/:id` - Delete provider (Admin only)

### Bookings

- `GET /api/v1/bookings` - Get all bookings (User: own, Admin: all)
- `GET /api/v1/bookings/:id` - Get single booking
- `POST /api/v1/carproviders/:carProviderId/bookings` - Create a booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Delete booking
