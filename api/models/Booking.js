const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  bookingDate: {
    type: Date,
    required: [true, "Please add a date for the booking"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  carProvider: {
    type: mongoose.Schema.ObjectId,
    ref: "CarProvider",
    required: true,
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    min: [0, "Price cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
