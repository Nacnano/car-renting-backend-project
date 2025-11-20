const Transaction = require("../models/Transaction");
const User = require("../models/User");

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  console.log("🔵 [TRANSACTIONS] GetTransactions function called");
  console.log(
    "👤 [TRANSACTIONS] User role:",
    req.user.role,
    "| User ID:",
    req.user.id
  );
  try {
    let query;

    // If user is not admin, they can only see their own transactions
    if (req.user.role !== "admin") {
      query = Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    } else {
      // Admin sees all
      query = Transaction.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });
    }

    const transactions = await query;
    console.log(
      "✅ [TRANSACTIONS] Retrieved",
      transactions.length,
      "transactions"
    );

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Cannot get transactions" });
  }
};

// @desc    Deposit money (Mock Payment)
// @route   POST /api/v1/transactions/deposit
// @access  Private
exports.deposit = async (req, res, next) => {
  console.log("🔵 [TRANSACTIONS] Deposit function called");
  console.log(
    "💰 [TRANSACTIONS] Deposit amount:",
    req.body.amount,
    "| User:",
    req.user.id
  );
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a positive amount" });
    }

    const user = await User.findById(req.user.id);
    console.log("💳 [TRANSACTIONS] Current balance:", user.balance);

    // Update balance
    user.balance += amount;
    await user.save();
    console.log(
      "✅ [TRANSACTIONS] Deposit successful - New balance:",
      user.balance
    );

    // Create Transaction Record
    const transaction = await Transaction.create({
      user: req.user.id,
      amount: amount,
      type: "deposit",
    });

    res.status(200).json({
      success: true,
      data: transaction,
      newBalance: user.balance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Cannot deposit money" });
  }
};

// @desc    Withdraw money
// @route   POST /api/v1/transactions/withdraw
// @access  Private
exports.withdraw = async (req, res, next) => {
  console.log("🔵 [TRANSACTIONS] Withdraw function called");
  console.log(
    "💰 [TRANSACTIONS] Withdraw amount:",
    req.body.amount,
    "| User:",
    req.user.id
  );
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide a positive amount" });
    }

    const user = await User.findById(req.user.id);
    console.log("💳 [TRANSACTIONS] Current balance:", user.balance);

    if (user.balance < amount) {
      console.log("❌ [TRANSACTIONS] Insufficient balance for withdrawal");
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    // Update balance
    user.balance -= amount;
    await user.save();
    console.log(
      "✅ [TRANSACTIONS] Withdrawal successful - New balance:",
      user.balance
    );

    // Create Transaction Record
    const transaction = await Transaction.create({
      user: req.user.id,
      amount: amount,
      type: "withdraw",
    });

    res.status(200).json({
      success: true,
      data: transaction,
      newBalance: user.balance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Cannot withdraw money" });
  }
};
