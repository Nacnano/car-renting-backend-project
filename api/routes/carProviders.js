const express = require("express");
const {
  getCarProviders,
  getCarProvider,
  createCarProvider,
  updateCarProvider,
  deleteCarProvider,
} = require("../controllers/carProviders");

//Include other resource routers
const bookingRouter = require("./bookings");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:carProviderId/bookings/", bookingRouter);

router
  .route("/")
  .get(getCarProviders)
  .post(protect, authorize("admin"), createCarProvider);

router
  .route("/:id")
  .get(getCarProvider)
  .put(protect, authorize("admin"), updateCarProvider)
  .delete(protect, authorize("admin"), deleteCarProvider);

module.exports = router;
