const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "Please add an amount"],
  },
  type: {
    type: String,
    enum: ["deposit", "withdraw", "payment", "refund"],
    required: true,
  },
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: "Booking",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
