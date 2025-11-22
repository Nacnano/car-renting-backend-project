# Newman API Test Suite

This directory contains a comprehensive Postman/Newman test collection for the Car Rental API.

## Test Collection

The `car-rental-api.postman_collection.json` file includes all tests organized into the following sections:

### Test Coverage

1. **User Registration + Validation**
   - Successful registration
   - Duplicate email validation
2. **User Login**

   - Successful login
   - Wrong password validation

3. **User View Products (Car Providers)**

   - Get all car providers
   - Get single car provider

4. **Wallet Features**

   - Check initial balance
   - Deposit money (success and validation)
   - Withdraw money (success and insufficient balance validation)
   - View transaction history

5. **User Create Booking**

   - Create booking successfully
   - Payment deduction from wallet

6. **Check Create Conditions**

   - Create multiple bookings (up to 3)
   - Test booking limit (4th booking should fail)
   - Verify balance after bookings

7. **User View Own Bookings**

   - Get all own bookings
   - Get single booking

8. **User Edit Own Booking**

   - Update booking date

9. **User Delete Own Booking (Refund)**

   - Delete booking
   - Verify refund to wallet
   - Check transaction history for refund
   - Verify booking count after delete

10. **User Logout**

    - Logout functionality

11. **Admin Login**

    - Admin authentication

12. **Admin View Any Booking**

    - Admin can see all users' bookings

13. **Admin Edit Any Booking**

    - Admin can update any booking

14. **Admin Delete Any Booking**
    - Admin can delete any booking

## How to Run the Tests

### Prerequisites

1. **MongoDB** - Make sure MongoDB is running and accessible
2. **Node.js** - Required to run the API server
3. **Newman** - Install globally with: `npm install -g newman`

### Steps to Run

#### Option 1: Manual (Recommended)

1. **Start the API Server** (in one terminal):

   ```powershell
   cd c:\Users\Vivobook\github\car-renting-backend-project\api
   npm run dev
   ```

2. **Run Newman Tests** (in another terminal):
   ```powershell
   cd c:\Users\Vivobook\github\car-renting-backend-project\api
   newman run tests/car-rental-api.postman_collection.json
   ```

#### Option 2: Using the provided scripts

**Windows (PowerShell)**:

```powershell
cd c:\Users\Vivobook\github\car-renting-backend-project\api\tests
.\run-tests.ps1
```

**Cross-platform**:

```bash
cd c:\Users\Vivobook\github\car-renting-backend-project\api\tests
npm test
```

### Expected Results

When all tests pass, you should see:

- ✓ All assertions passing
- 34 requests executed successfully
- 71 assertions passed
- Transaction history showing deposits, withdrawals, payments, and refunds
- Proper wallet balance management throughout the test flow

### Test Features

- **Dynamic Data**: Uses timestamps to ensure unique test data
- **Comprehensive Coverage**: Tests all CRUD operations
- **Wallet Integration**: Validates all financial transactions
- **Role-Based Testing**: Tests both user and admin functionality
- **Validation Tests**: Includes negative test cases (wrong password, insufficient balance, booking limits, etc.)

## Importing to Postman

You can import `car-rental-api.postman_collection.json` directly into Postman to:

- Run tests interactively
- Debug individual requests
- View detailed responses
- Modify test cases

## Notes

- Tests create temporary users with timestamp-based emails
- The collection cleans up by deleting the car provider at the end
- Each test run is isolated with unique data
- Balance calculations are verified at each step
