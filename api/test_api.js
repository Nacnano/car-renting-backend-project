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

  console.log("--- Starting Tests ---");

  // 1. Register Admin
  console.log(`\n1. Registering Admin (${adminEmail})...`);
  let res = await request("POST", "/auth/register", null, {
    name: "Admin User",
    email: adminEmail,
    password: password,
    telephone: "1234567890",
    role: "admin",
  });
  console.log(`Status: ${res.status}`, res.data.success ? "SUCCESS" : "FAILED");
  if (!res.data.success) {
    console.log("Response:", JSON.stringify(res.data, null, 2));
    return;
  }
  let adminToken = res.data.token;

  // If register doesn't return token, try login
  if (!adminToken) {
    console.log("Token not found in register response, trying login...");
    res = await request("POST", "/auth/login", null, {
      email: adminEmail,
      password,
    });
    adminToken = res.data.token;
  }

  if (!adminToken) {
    console.log("Failed to get admin token");
    return;
  }
  console.log("Admin Token received");

  // 2. Create Car Provider
  console.log(`\n2. Creating Car Provider...`);
  res = await request("POST", "/carproviders", adminToken, {
    name: `Best Cars ${timestamp}`,
    address: "123 Main St",
    telephone: "555-1234",
  });
  console.log(`Status: ${res.status}`, res.data.success ? "SUCCESS" : "FAILED");
  if (!res.data.success) {
    console.log("Response:", JSON.stringify(res.data, null, 2));
    return;
  }
  const carProviderId = res.data.data._id;
  console.log(`Car Provider ID: ${carProviderId}`);

  // 3. Register User
  console.log(`\n3. Registering User (${userEmail})...`);
  res = await request("POST", "/auth/register", null, {
    name: "Regular User",
    email: userEmail,
    password: password,
    telephone: "0987654321",
    role: "user",
  });
  console.log(`Status: ${res.status}`, res.data.success ? "SUCCESS" : "FAILED");

  let userToken = res.data.token;
  if (!userToken) {
    res = await request("POST", "/auth/login", null, {
      email: userEmail,
      password,
    });
    userToken = res.data.token;
  }
  console.log("User Token received");

  // 4. Create Booking
  console.log(`\n4. Creating Booking...`);
  // Route: POST /carproviders/:carProviderId/bookings
  res = await request(
    "POST",
    `/carproviders/${carProviderId}/bookings`,
    userToken,
    {
      bookingDate: "2025-12-25",
    }
  );
  console.log(`Status: ${res.status}`, res.data.success ? "SUCCESS" : "FAILED");
  if (!res.data.success) {
    console.log("Response:", JSON.stringify(res.data, null, 2));
  } else {
    const bookingId = res.data.data._id;
    console.log(`Booking ID: ${bookingId}`);

    // 5. Get Bookings
    console.log(`\n5. Getting Bookings...`);
    res = await request("GET", "/bookings", userToken);
    console.log(
      `Status: ${res.status}`,
      res.data.count === 1 ? "SUCCESS" : "FAILED"
    );
    console.log("Bookings count:", res.data.count);

    // 6. Delete Booking
    console.log(`\n6. Deleting Booking...`);
    res = await request("DELETE", `/bookings/${bookingId}`, userToken);
    console.log(
      `Status: ${res.status}`,
      res.data.success ? "SUCCESS" : "FAILED"
    );
  }

  // 7. Delete Car Provider
  console.log(`\n7. Deleting Car Provider...`);
  res = await request("DELETE", `/carproviders/${carProviderId}`, adminToken);
  console.log(`Status: ${res.status}`, res.data.success ? "SUCCESS" : "FAILED");

  console.log("\n--- Tests Completed ---");
}

test().catch(console.error);
