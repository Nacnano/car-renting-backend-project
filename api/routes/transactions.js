const express = require("express");
const {
  getTransactions,
  deposit,
  withdraw,
} = require("../controllers/transactions");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.use(protect);

router.route("/").get(getTransactions);
router.route("/deposit").post(deposit);
router.route("/withdraw").post(withdraw);

module.exports = router;
