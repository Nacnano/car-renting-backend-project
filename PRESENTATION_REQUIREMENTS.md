# Car Renting Backend Project - Presentation Requirements

## 📋 Overview

This document outlines the presentation requirements for the Car Renting Backend Project (Backend Course Final Project - Chulalongkorn University).

---

## 1. โจทย์ที่ได้รับ (Assignment Problem)

**Project Title:** Car Renting Backend System

**Description:**

- Develop a rental car booking system with an integrated wallet system
- Implement user authentication and authorization
- Create RESTful API endpoints for car providers, bookings, and transactions
- Support both user and admin roles with different permissions
- Implement a wallet system for deposits, withdrawals, payments, and refunds

**Key Requirements:**

- User registration and login with JWT authentication
- Car provider management (CRUD operations)
- Booking system with payment integration
- Wallet system for financial transactions
- Role-based access control (User vs Admin)
- Database design using MongoDB

---

## 2. โค้ดโปรแกรมที่ได้แก้ไขไปจากของเดิม (Code Changes from Assignment 7)

### Major Changes and Implementations:

#### **Backend (Node.js + Express + MongoDB)**

1. **Enhanced Authentication System** (`api/controllers/auth.js`)

   - Added JWT token generation and verification
   - Implemented cookie-based authentication
   - Added role-based authorization middleware
   - Enhanced security with bcrypt password hashing

2. **Wallet System Implementation** (`api/controllers/transactions.js`)

   - NEW: Deposit endpoint for adding funds
   - NEW: Withdraw endpoint for removing funds
   - NEW: Transaction history tracking
   - NEW: Balance management in User model

3. **Booking Payment Integration** (`api/controllers/bookings.js`)

   - Added automatic payment deduction when creating bookings
   - Implemented booking limit (3 bookings per user)
   - Added automatic refund when deleting bookings
   - Integrated transaction logging for all payments/refunds

4. **Car Provider Pricing** (`api/models/CarProvider.js`)

   - Added price field to CarProvider model
   - Each provider can set their own rental price
   - Default price: 1000 Baht

5. **Security Enhancements** (`api/server.js`)

   - Helmet for security headers
   - XSS protection
   - MongoDB injection prevention
   - Rate limiting
   - CORS configuration

6. **Database Models**
   - User model with balance field
   - CarProvider model with price field
   - Booking model storing price at booking time
   - Transaction model for wallet operations

#### **Frontend (React + TypeScript + Vite)**

1. **Authentication Pages**

   - Login page with form validation
   - Register page with user creation
   - JWT token management

2. **Dashboard & Navigation**

   - Protected routes with authentication checks
   - Role-based UI rendering
   - Responsive navigation bar

3. **Wallet Management Page**

   - Deposit funds interface
   - Withdraw funds interface
   - Transaction history display
   - Real-time balance updates

4. **Booking Management**

   - View all bookings
   - Create new bookings with payment
   - Delete bookings with automatic refund
   - Integration with wallet system

5. **Car Provider Management**
   - List all car providers
   - Admin-only CRUD operations
   - Price display and management

---

## 3. Documents (UML Diagrams)

### 3.1 Use Case Diagram

**Actors:**

- User (Regular user)
- Admin (Administrator)
- System (Automated processes)

**Use Cases:**

- Register/Login/Logout
- View Car Providers
- Create/View/Update/Delete Bookings
- Deposit/Withdraw Money
- View Transaction History
- [Admin] Manage Car Providers (CRUD)
- [Admin] View All Bookings
- [System] Process Payment
- [System] Process Refund

📎 **PlantUML File:** `diagrams/use-case-diagram.puml`

📎 **View Online:** [Generate diagram at PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)

### 3.2 Class Diagram (UML Profile)

**Main Classes:**

1. **User**

   - Attributes: \_id, name, email, telephone, role, password, balance, createdAt
   - Methods: getSignedJwtToken(), matchPassword()
   - Relations: 1-to-many with Booking, 1-to-many with Transaction

2. **CarProvider**

   - Attributes: \_id, name, address, telephone, price
   - Relations: 1-to-many with Booking

3. **Booking**

   - Attributes: \_id, bookingDate, user (FK), carProvider (FK), price, createdAt
   - Relations: Many-to-1 with User, Many-to-1 with CarProvider, 1-to-1 with Transaction

4. **Transaction**
   - Attributes: \_id, user (FK), amount, type, booking (FK), createdAt
   - Relations: Many-to-1 with User, 1-to-1 with Booking (optional)

📎 **PlantUML File:** `diagrams/class-diagram.puml`

📎 **View Online:** [Generate diagram at PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)

### 3.3 Sequence Diagram

**Key Scenarios:**

1. **User Registration Flow**

   - User → Frontend → Backend → Database → Response

2. **Login and Authentication Flow**

   - User → Login Page → Auth Controller → JWT Generation → Token Response

3. **Create Booking with Payment**

   - User → Booking Page → Check Balance → Deduct Payment → Create Booking → Create Transaction → Update Balance

4. **Delete Booking with Refund**

   - User → Delete Request → Find Booking → Calculate Refund → Update Balance → Create Transaction → Delete Booking

5. **Deposit/Withdraw Flow**
   - User → Wallet Page → Transaction Controller → Update Balance → Create Transaction Record

📎 **PlantUML Files:**

- User Registration: `diagrams/sequence-register.puml`
- User Login: `diagrams/sequence-login.puml`
- Create Booking with Payment: `diagrams/sequence-create-booking.puml`
- Delete Booking with Refund: `diagrams/sequence-delete-booking.puml`
- Deposit Money: `diagrams/sequence-deposit.puml`
- Withdraw Money: `diagrams/sequence-withdraw.puml`

📎 **View Online:** [Generate diagrams at PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)

**Changes from Assignment 7:**

- Added wallet/transaction flows
- Added payment integration in booking creation
- Added refund logic in booking deletion
- Enhanced authentication with JWT

---

## 4. การแบ่งงานในทีม (Team Contributions)

### GitHub Contributors

To view detailed contribution statistics:

```
Visit: https://github.com/Nacnano/car-renting-backend-project/graphs/contributors
```

### Task Distribution:

**[Member 1 Name]**

- Backend API development
- Database schema design
- Authentication system implementation

**[Member 2 Name]**

- Frontend development (React + TypeScript)
- UI/UX design with TailwindCSS
- API integration

**[Member 3 Name]** (if applicable)

- Wallet system implementation
- Transaction management
- Testing and debugging

**[Member 4 Name]** (if applicable)

- Documentation
- Deployment
- Security implementation

> **Note:** Update with actual team member names and specific contributions from GitHub insights.

---

## 5. Additional Requirements (Extra Credits)

### List of Extra Features Implemented:

#### ✨ Feature 1: Wallet System

- **Description:** Complete wallet management system with deposit, withdraw, payment, and refund capabilities
- **Implementation:**
  - Transaction model for tracking all financial operations
  - Balance management in User model
  - Automatic payment on booking creation
  - Automatic refund on booking deletion
- **Video Demo Link:** [To be added]

#### ✨ Feature 2: Advanced Security

- **Description:** Enterprise-level security implementation
- **Implementation:**
  - JWT authentication with token expiration
  - Password hashing with bcrypt
  - XSS protection with xss-clean
  - MongoDB injection prevention
  - Helmet for security headers
  - Rate limiting to prevent abuse
- **Video Demo Link:** [To be added]

#### ✨ Feature 3: Dynamic Pricing System

- **Description:** Each car provider can set their own rental price
- **Implementation:**
  - Price field in CarProvider model
  - Booking stores price at creation time
  - Prevents price changes from affecting existing bookings
- **Video Demo Link:** [To be added]

#### ✨ Feature 4: Transaction History & Audit Trail

- **Description:** Complete financial audit trail for all operations
- **Implementation:**
  - Transaction model tracking all wallet activities
  - Timestamp for every transaction
  - User-specific transaction history
  - Admin can view all transactions
- **Video Demo Link:** [To be added]

#### ✨ Feature 5: Frontend with React + TypeScript

- **Description:** Modern, responsive frontend application
- **Implementation:**
  - React with TypeScript for type safety
  - TailwindCSS for modern UI design
  - Protected routes with authentication
  - Real-time balance updates
  - Toast notifications for user feedback
- **Video Demo Link:** [To be added]

#### ✨ Feature 6: Role-Based Access Control (RBAC)

- **Description:** Comprehensive permission system
- **Implementation:**
  - User and Admin roles
  - Different permissions per role
  - Admin-only endpoints for car provider management
  - Users limited to 3 bookings (admins exempt)
- **Video Demo Link:** [To be added]

#### ✨ Feature 7: Advanced Query Features

- **Description:** Flexible API querying capabilities
- **Implementation:**
  - Filtering by any field
  - Sorting (ascending/descending)
  - Field selection
  - Pagination support
  - Search functionality
- **Video Demo Link:** [To be added]

#### ✨ Feature 8: Seed Scripts & Database Management

- **Description:** Automated database seeding and migration
- **Implementation:**
  - `seedAdmin.js` - Create default admin account
  - `seedBookings.js` - Generate sample bookings
  - Migration scripts for data updates
- **Video Demo Link:** [To be added]

---

## 6. Links & Resources

### 📂 Project GitHub Repository

**Main Repository:** https://github.com/Nacnano/car-renting-backend-project

**Repository Structure:**

- `/api` - Backend Node.js application
- `/client` - Frontend React application
- `/api/models` - MongoDB schemas
- `/api/controllers` - Business logic
- `/api/routes` - API endpoints
- `/api/middleware` - Authentication & authorization

### 📊 Team & Project Information

**Course Spreadsheet:** https://docs.google.com/spreadsheets/d/1SzyLqMEnz3IdQNkSZV6f6knIregL74eIG_5FHB3rHfU

---

## 7. Demo Information

### Live Demo Notes:

The presentation will include a live demonstration covering:

1. **User Registration & Login**

   - Create new user account
   - Login with credentials
   - JWT token authentication

2. **Wallet Operations**

   - Deposit funds into wallet
   - Check current balance
   - View transaction history

3. **Booking Process**

   - Browse available car providers
   - Create new booking with automatic payment
   - View booking details
   - Delete booking with automatic refund

4. **Admin Features**

   - Login as admin
   - Create new car provider
   - Update provider information
   - Delete car provider
   - View all bookings from all users

5. **Transaction History**
   - View all wallet transactions
   - Filter by transaction type
   - Track payments and refunds

### Test Accounts:

**Admin Account:**

- Email: `admin@example.com`
- Password: `admin123`
- Balance: 10,000 Baht

**Regular User Account:**

- Create during demo or use pre-seeded account

---

## 8. Technical Stack Summary

### Backend:

- Node.js v14+
- Express.js 4.x
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend:

- React 18
- TypeScript
- Vite (build tool)
- TailwindCSS
- React Router
- Axios
- React Hot Toast

### Security:

- helmet
- express-mongo-sanitize
- xss-clean
- express-rate-limit
- hpp (HTTP Parameter Pollution)
- CORS

---

## 9. Installation & Running Instructions

### Backend Setup:

```bash
cd api
npm install
# Create config/config.env with MONGO_URI, JWT_SECRET, etc.
npm run dev
```

### Frontend Setup:

```bash
cd client
npm install
npm run dev
```

### Seed Admin Account:

```bash
cd api
node scripts/seedAdmin.js
```

---

## 10. API Documentation

### Base URL: `http://localhost:5000/api/v1`

### Endpoints Summary:

**Authentication:**

- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user
- GET `/auth/logout` - Logout user

**Car Providers:**

- GET `/carproviders` - Get all providers
- GET `/carproviders/:id` - Get single provider
- POST `/carproviders` - Create provider (Admin only)
- PUT `/carproviders/:id` - Update provider (Admin only)
- DELETE `/carproviders/:id` - Delete provider (Admin only)

**Bookings:**

- GET `/bookings` - Get user's bookings
- GET `/bookings/:id` - Get single booking
- POST `/carproviders/:carProviderId/bookings` - Create booking
- PUT `/bookings/:id` - Update booking
- DELETE `/bookings/:id` - Delete booking (with refund)

**Transactions:**

- GET `/transactions` - Get transaction history
- POST `/transactions/deposit` - Deposit funds
- POST `/transactions/withdraw` - Withdraw funds

---

## Notes for Presentation

1. **Time Management:** Allocate appropriate time for each section
2. **Live Demo:** Ensure database is seeded and server is running
3. **Backup Plan:** Have screenshots/video ready in case of technical issues
4. **Questions:** Prepare for questions about architecture decisions and security
5. **Extra Credits:** Clearly demonstrate each additional feature implemented

---

**Prepared by:** [Your Team Name]
**Date:** November 22, 2025
**Course:** Backend Development - Chulalongkorn University
