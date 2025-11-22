const BASE_URL = "http://localhost:5000/api/v1";

async function test() {
  const timestamp = Date.now();
  const adminEmail = `admin${timestamp}@test.com`;
  const userEmail = `user${timestamp}@test.com`;
  const password = "password123";

  // Helper for requests
  async function request(method, endpoint, token, body) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await res.json();
      return { status: res.status, data };
    } catch (error) {
      console.error(`Error requesting ${endpoint}:`, error.message);
      return { status: 500, data: { success: false, error: error.message } };
    }
  }

  console.log("--- Starting Comprehensive Tests ---");

  // --- 1. Admin Setup ---
  console.log(`\n[1] Registering Admin (${adminEmail})...`);
  let res = await request("POST", "/auth/register", null, {
    name: "Admin User",
    email: adminEmail,
    password: password,
    telephone: "1234567890",
    role: "admin",
  });
  let adminToken = res.data.token;
  if (!adminToken) {
    res = await request("POST", "/auth/login", null, {
      email: adminEmail,
      password,
    });
    adminToken = res.data.token;
  }
  console.log(`Admin Token: ${adminToken ? "OK" : "MISSING"}`);

  // --- 2. Create Car Provider ---
  console.log(`\n[2] Admin creating Car Provider...`);
  res = await request("POST", "/carproviders", adminToken, {
    name: `Best Cars ${timestamp}`,
    address: "123 Main St",
    telephone: "555-1234",
  });
  const carProviderId = res.data.data._id;
  console.log(
    `Car Provider Created: ${res.data.success} (ID: ${carProviderId})`
  );

  // --- 3. User Registration & Login ---
  console.log(`\n[3] Registering User (${userEmail})...`);
  res = await request("POST", "/auth/register", null, {
    name: "Regular User",
    email: userEmail,
    password: password,
    telephone: "0987654321",
    role: "user",
  });
  let userToken = res.data.token;
  if (!userToken) {
    res = await request("POST", "/auth/login", null, {
      email: userEmail,
      password,
    });
    userToken = res.data.token;
  }
  console.log(`User Token: ${userToken ? "OK" : "MISSING"}`);

  // --- 4. Wallet Tests ---
  console.log(`\n[4] Testing Wallet Features...`);

  // 4a. Check Initial Balance
  console.log(`   Checking Initial Balance...`);
  res = await request("GET", "/auth/me", userToken);
  console.log(`   -> Balance: ${res.data.data.balance} (Expected 0)`);

  // 4b. Try Booking with 0 Balance (Should Fail)
  console.log(`   Trying Booking with 0 Balance...`);
  res = await request(
    "POST",
    `/carproviders/${carProviderId}/bookings`,
    userToken,
    {
      bookingDate: "2025-12-25",
    }
  );
  console.log(`   -> Status: ${res.status} (Expected 400)`);
  console.log(`   -> Message: ${res.data.message}`);

  // 4c. Deposit Money
  console.log(`   Depositing 5000...`);
  res = await request("POST", "/transactions/deposit", userToken, {
    amount: 5000,
  });
  console.log(`   -> New Balance: ${res.data.newBalance} (Expected 5000)`);

  // 4d. Withdraw Money
  console.log(`   Withdrawing 500...`);
  res = await request("POST", "/transactions/withdraw", userToken, {
    amount: 500,
  });
  console.log(`   -> New Balance: ${res.data.newBalance} (Expected 4500)`);

  // --- 5. User Booking Limit (Max 3) & Payment ---
  console.log(`\n[5] Testing Booking Limit & Payment (Cost 1000 each)...`);
  const bookingIds = [];

  // Book 3 cars (Cost 3000 total)
  for (let i = 1; i <= 3; i++) {
    console.log(`   Booking ${i}...`);
    res = await request(
      "POST",
      `/carproviders/${carProviderId}/bookings`,
      userToken,
      {
        bookingDate: `2025-12-0${i}`,
      }
    );
    if (res.data.success) {
      bookingIds.push(res.data.data._id);
      console.log(`   -> Success (ID: ${res.data.data._id})`);
    } else {
      console.log(`   -> Failed: ${res.data.message}`);
    }
  }

  // Check Balance after 3 bookings (4500 - 3000 = 1500)
  res = await request("GET", "/auth/me", userToken);
  console.log(
    `   -> Balance after bookings: ${res.data.data.balance} (Expected 1500)`
  );

  // Try to book 4th car (Should fail due to limit, not balance)
  console.log(`   Booking 4 (Should Fail Limit)...`);
  res = await request(
    "POST",
    `/carproviders/${carProviderId}/bookings`,
    userToken,
    {
      bookingDate: "2025-12-04",
    }
  );
  console.log(`   -> Status: ${res.status} (Expected 400)`);
  console.log(`   -> Message: ${res.data.message}`);

  // --- 6. User View Bookings ---
  console.log(`\n[6] User Viewing Own Bookings...`);
  res = await request("GET", "/bookings", userToken);
  console.log(`Count: ${res.data.count} (Expected 3)`);

  // --- 7. User Edit Booking ---
  if (bookingIds.length > 0) {
    console.log(`\n[7] User Editing Booking 1...`);
    res = await request("PUT", `/bookings/${bookingIds[0]}`, userToken, {
      bookingDate: "2026-01-01",
    });
    console.log(`Update Status: ${res.status} (Expected 200)`);
    console.log(`New Date: ${res.data.data.bookingDate}`);
  }

  // --- 8. User Delete Booking & Refund ---
  if (bookingIds.length > 0) {
    console.log(`\n[8] User Deleting Booking 1 (Refund 1000)...`);
    res = await request("DELETE", `/bookings/${bookingIds[0]}`, userToken);
    console.log(`Delete Status: ${res.status} (Expected 200)`);

    // Check Balance after refund (1500 + 1000 = 2500)
    res = await request("GET", "/auth/me", userToken);
    console.log(
      `   -> Balance after refund: ${res.data.data.balance} (Expected 2500)`
    );

    bookingIds.shift();
  }

  // --- 9. Transaction History ---
  console.log(`\n[9] Checking Transaction History...`);
  res = await request("GET", "/transactions", userToken);
  console.log(`Transaction Count: ${res.data.count}`);
  // Expected: Deposit(1) + Withdraw(1) + Payments(3) + Refund(1) = 6
  console.log(`   -> Expected ~6 transactions`);

  // --- 10. Admin View All Bookings ---
  console.log(`\n[10] Admin Viewing All Bookings...`);
  res = await request("GET", "/bookings", adminToken);
  console.log(
    `Admin View Count: ${res.data.count} (Should be >= ${bookingIds.length})`
  );

  // --- 11. Admin Edit User's Booking ---
  if (bookingIds.length > 0) {
    console.log(`\n[11] Admin Editing User's Booking...`);
    res = await request("PUT", `/bookings/${bookingIds[0]}`, adminToken, {
      bookingDate: "2026-02-02",
    });
    console.log(`Admin Update Status: ${res.status} (Expected 200)`);
  }

  // --- 12. Admin Delete User's Booking ---
  if (bookingIds.length > 0) {
    console.log(`\n[12] Admin Deleting User's Booking...`);
    res = await request("DELETE", `/bookings/${bookingIds[0]}`, adminToken);
    console.log(`Admin Delete Status: ${res.status} (Expected 200)`);
  }

  // --- 13. Cleanup ---
  console.log(`\n[13] Cleanup (Deleting Car Provider)...`);
  res = await request("DELETE", `/carproviders/${carProviderId}`, adminToken);
  console.log(`Cleanup Status: ${res.status}`);

  console.log("\n--- Tests Completed ---");
}

test().catch(console.error);
