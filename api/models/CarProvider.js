const mongoose = require("mongoose");

const CarProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    telephone: {
      type: String,
      required: [true, "Please add a telephone number"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete bookings when a car provider is deleted
CarProviderSchema.pre("remove", async function (next) {
  console.log(`Bookings being removed from car provider ${this._id}`);
  await this.model("Booking").deleteMany({ carProvider: this._id });
  next();
});

// Reverse populate with virtuals
CarProviderSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "carProvider",
  justOne: false,
});

module.exports = mongoose.model("CarProvider", CarProviderSchema);
