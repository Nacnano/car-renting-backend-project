const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Booking = require("./models/Booking");
const CarProvider = require("./models/CarProvider");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateBookingPrices = async () => {
  try {
    console.log("🔄 Starting to update booking prices...");

    // Get all bookings
    const bookings = await Booking.find().populate("carProvider");
    console.log(`📋 Found ${bookings.length} bookings`);

    // Update bookings that don't have a price
    let updated = 0;
    for (const booking of bookings) {
      if (!booking.price || booking.price === 0) {
        const price = booking.carProvider?.price || 1000; // Use provider's price or default
        booking.price = price;
        await booking.save();
        console.log(`✅ Updated booking ${booking._id} with price: ${price}`);
        updated++;
      } else {
        console.log(
          `⏭️  Booking ${booking._id} already has price: ${booking.price}`
        );
      }
    }

    console.log(`\n🎉 Migration completed! Updated ${updated} bookings.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating booking prices:", error);
    process.exit(1);
  }
};

updateBookingPrices();
