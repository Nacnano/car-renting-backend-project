const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAdmin = async () => {
  try {
    console.log("🌱 Starting to seed admin account...");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️  Admin account already exists");
      console.log("📧 Email: admin@example.com");
      console.log("🔑 Password: admin123");
      process.exit(0);
    }

    // Create admin account
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      telephone: "0800000000",
      role: "admin",
      balance: 10000,
    });

    console.log("✅ Admin account created successfully!");
    console.log("👤 Name:", admin.name);
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");
    console.log("💰 Balance:", admin.balance);
    console.log("\n🎉 You can now login with these credentials!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
