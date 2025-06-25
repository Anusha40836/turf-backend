const express = require("express");
const router = express.Router();
const {
  bookTurf,
  getMyBookings,
  deleteBooking,
  getBookedSlots,
  getAllBookings,
} = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, bookTurf);
router.get("/", verifyToken, getMyBookings);
router.delete("/:id", verifyToken, deleteBooking); // ✅ Add this line
// Get booked time slots for a turf on a date
router.get("/slots/:turfId/:date", verifyToken, getBookedSlots);
router.get("/admin", verifyToken, getAllBookings);

module.exports = router;
