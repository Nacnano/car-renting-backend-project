const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CarProvider = require("./models/CarProvider");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateCarProviderPrices = async () => {
  try {
    console.log("🔄 Starting to update car provider prices...");

    // Get all car providers
    const providers = await CarProvider.find();
    console.log(`📋 Found ${providers.length} car providers`);

    // Update providers that don't have a price
    let updated = 0;
    for (const provider of providers) {
      if (!provider.price || provider.price === 0) {
        provider.price = 1000; // Default price
        await provider.save();
        console.log(`✅ Updated ${provider.name} with price: 1000`);
        updated++;
      } else {
        console.log(
          `⏭️  ${provider.name} already has price: ${provider.price}`
        );
      }
    }

    console.log(`\n🎉 Migration completed! Updated ${updated} providers.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating prices:", error);
    process.exit(1);
  }
};

updateCarProviderPrices();
