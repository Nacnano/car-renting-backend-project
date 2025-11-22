const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Booking = require("./models/Booking");
const User = require("./models/User");
const CarProvider = require("./models/CarProvider");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedBookings = async () => {
  try {
    console.log("🌱 Starting to seed bookings...");

    // Get existing users
    const users = await User.find();
    if (users.length === 0) {
      console.log("❌ No users found. Please create users first.");
      process.exit(1);
    }
    console.log(`✅ Found ${users.length} users`);

    // Get existing car providers
    const carProviders = await CarProvider.find();
    if (carProviders.length === 0) {
      console.log(
        "❌ No car providers found. Please create car providers first."
      );
      process.exit(1);
    }
    console.log(`✅ Found ${carProviders.length} car providers`);

    // Create 5 bookings with random users and providers
    const bookingsData = [
      {
        bookingDate: new Date("2025-12-01"),
        user: users[0]._id,
        carProvider: carProviders[0]._id,
      },
      {
        bookingDate: new Date("2025-12-05"),
        user: users[Math.floor(Math.random() * users.length)]._id,
        carProvider:
          carProviders[Math.floor(Math.random() * carProviders.length)]._id,
      },
      {
        bookingDate: new Date("2025-12-10"),
        user: users[Math.floor(Math.random() * users.length)]._id,
        carProvider:
          carProviders[Math.floor(Math.random() * carProviders.length)]._id,
      },
      {
        bookingDate: new Date("2025-12-15"),
        user: users[Math.floor(Math.random() * users.length)]._id,
        carProvider:
          carProviders[Math.floor(Math.random() * carProviders.length)]._id,
      },
      {
        bookingDate: new Date("2025-12-20"),
        user: users[Math.floor(Math.random() * users.length)]._id,
        carProvider:
          carProviders[Math.floor(Math.random() * carProviders.length)]._id,
      },
    ];

    // Insert bookings
    const bookings = await Booking.insertMany(bookingsData);
    console.log(`✅ Successfully created ${bookings.length} bookings:`);
    bookings.forEach((booking, index) => {
      console.log(
        `   ${index + 1}. Booking on ${booking.bookingDate.toDateString()}`
      );
    });

    console.log("🎉 Seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding bookings:", error);
    process.exit(1);
  }
};

seedBookings();
