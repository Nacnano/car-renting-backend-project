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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
