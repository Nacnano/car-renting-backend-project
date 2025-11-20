const Booking = require("../models/Booking");
const CarProvider = require("../models/CarProvider");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

//@desc     Get all bookings
//@route    GET /api/v1/bookings
//@access   Public
exports.getBookings = async (req, res, next) => {
  console.log("🔵 [BOOKINGS] GetBookings function called");
  console.log(
    "👤 [BOOKINGS] User role:",
    req.user.role,
    "| User ID:",
    req.user.id
  );
  let query;
  //General users can see only their bookings!
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "carProvider",
      select: "name address telephone",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.carProviderId) {
      query = Booking.find({ carProvider: req.params.carProviderId }).populate({
        path: "carProvider",
        select: "name address telephone",
      });
    } else {
      query = Booking.find().populate({
        path: "carProvider",
        select: "name address telephone",
      });
    }
  }

  try {
    const bookings = await query;
    console.log("✅ [BOOKINGS] Retrieved", bookings.length, "bookings");

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Get single booking
//@route    GET /api/v1/bookings/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
  console.log(
    "🔵 [BOOKINGS] GetBooking function called for ID:",
    req.params.id
  );
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "carProvider",
      select: "name address telephone",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc     Add booking
//@route    POST /api/v1/carproviders/:carProviderId/bookings
//@access   Private
exports.addBooking = async (req, res, next) => {
  console.log("🔵 [BOOKINGS] AddBooking function called");
  console.log(
    "📝 [BOOKINGS] User:",
    req.user.id,
    "| Provider:",
    req.params.carProviderId
  );
  try {
    req.body.carProvider = req.params.carProviderId;
    req.body.user = req.user.id;

    const carProvider = await CarProvider.findById(req.params.carProviderId);

    if (!carProvider) {
      return res.status(404).json({
        success: false,
        message: `No car provider with the id of ${req.params.carProviderId}`,
      });
    }

    //Check for existed booking
    const existedBookings = await Booking.find({ user: req.user.id });
    console.log(
      "📊 [BOOKINGS] User has",
      existedBookings.length,
      "existing bookings"
    );

    //If the user is not an admin, they can only create 3 bookings.
    if (existedBookings.length >= 3 && req.user.role !== "admin") {
      console.log("❌ [BOOKINGS] Booking limit reached");

      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }

    // --- PAYMENT LOGIC START ---
    const COST_PER_BOOKING = 1000; // Mock price
    const user = await User.findById(req.user.id);
    console.log(
      "💰 [BOOKINGS] Payment check - User balance:",
      user.balance,
      "| Cost:",
      COST_PER_BOOKING
    );

    if (user.balance < COST_PER_BOOKING) {
      console.log("❌ [BOOKINGS] Insufficient balance");

      return res.status(400).json({
        success: false,
        message: `Insufficient balance. You need ${COST_PER_BOOKING} but have ${user.balance}. Please deposit money first.`,
      });
    }

    // Deduct money
    user.balance -= COST_PER_BOOKING;
    await user.save();
    console.log("💳 [BOOKINGS] Payment processed - New balance:", user.balance);
    // --- PAYMENT LOGIC END ---

    const booking = await Booking.create(req.body);
    console.log("✅ [BOOKINGS] Booking created:", booking._id);

    // --- TRANSACTION RECORD START ---
    await Transaction.create({
      user: req.user.id,
      amount: -COST_PER_BOOKING,
      type: "payment",
      booking: booking._id,
    });
    console.log("📝 [BOOKINGS] Transaction recorded for booking:", booking._id);
    // --- TRANSACTION RECORD END ---

    res.status(200).json({
      success: true,
      data: booking,
      message: `Booking created. ${COST_PER_BOOKING} deducted from wallet.`,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Booking" });
  }
};

//@desc     Update booking
//@route    PUT /api/v1/bookings/:id
//@access   Private
exports.updateBooking = async (req, res, next) => {
  console.log(
    "🔵 [BOOKINGS] UpdateBooking function called for ID:",
    req.params.id
  );
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      console.log(
        "❌ [BOOKINGS] Unauthorized update attempt by user:",
        req.user.id
      );
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("✅ [BOOKINGS] Booking updated:", req.params.id);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc     Delete booking
//@route    DELETE /api/v1/bookings/:id
//@access   Private
exports.deleteBooking = async (req, res, next) => {
  console.log(
    "🔵 [BOOKINGS] DeleteBooking function called for ID:",
    req.params.id
  );
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      console.log(
        "❌ [BOOKINGS] Unauthorized delete attempt by user:",
        req.user.id
      );
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    // --- REFUND LOGIC START ---
    const REFUND_AMOUNT = 1000; // Mock price
    const user = await User.findById(booking.user); // Refund to the booking owner
    console.log(
      "💰 [BOOKINGS] Processing refund of",
      REFUND_AMOUNT,
      "to user:",
      booking.user
    );

    if (user) {
      user.balance += REFUND_AMOUNT;
      await user.save();
      console.log(
        "💳 [BOOKINGS] Refund processed - New balance:",
        user.balance
      );

      await Transaction.create({
        user: user._id,
        amount: REFUND_AMOUNT,
        type: "refund",
        booking: booking._id,
      });
      console.log("📝 [BOOKINGS] Refund transaction recorded");
    }
    // --- REFUND LOGIC END ---

    await booking.remove();
    console.log("✅ [BOOKINGS] Booking deleted:", req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: "Booking deleted and refunded",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};
