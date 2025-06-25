const Booking = require("../models/Booking");

const bookTurf = async (req, res) => {
  const { turfId, date, timeSlot } = req.body;
  console.log("🌿 Booking Attempt =>", { turfId, date, timeSlot });
  console.log("🔐 User from token =>", req.user);

  try {
    const exists = await Booking.findOne({ turf: turfId, date, timeSlot });
    if (exists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = new Booking({
      user: req.user.id,
      turf: turfId,
      date,
      timeSlot,
    });

    await booking.save();
    console.log("✅ Booking saved:", booking);

    res.status(201).json({ message: "Booking successful", booking });
  } catch (err) {
    console.error("❌ Booking Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("turf");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, // Only allow user to delete their own bookings
    });

    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found or unauthorized" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete Booking Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const { turfId, date } = req.params;

    const bookings = await Booking.find({ turf: turfId, date });
    const bookedSlots = bookings.map((b) => b.timeSlot);

    res.json(bookedSlots);
  } catch (err) {
    console.error("Get Booked Slots Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("turf")
      .populate("user", "name email"); // Show only name & email

    res.json(bookings);
  } catch (err) {
    console.error("Admin getAllBookings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  bookTurf,
  getMyBookings,
  deleteBooking,
  getBookedSlots,
  getAllBookings, // ✅ export it
};
