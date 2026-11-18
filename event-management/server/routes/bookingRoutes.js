
const express = require("express");

const router = express.Router();

const {
    createBooking,
    getMyBookings,
    cancelBooking
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

// All booking routes require login
router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.put("/cancel/:id", protect, cancelBooking);

module.exports = router;
