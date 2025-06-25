const Turf = require("../models/Turf");

// Add new turf (Admin only)
const addTurf = async (req, res) => {
  const { name, location, pricePerHour, image } = req.body;

  try {
    const newTurf = new Turf({ name, location, pricePerHour, image });
    await newTurf.save();
    res.status(201).json({ message: "Turf added successfully", turf: newTurf });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all turfs (Public)
const getTurfs = async (req, res) => {
  const search = req.query.search || "";
  try {
    const turfs = await Turf.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    });
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a turf (Admin only)
const deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findByIdAndDelete(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    res.json({ message: "Turf deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a turf (Admin only)
const updateTurf = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, pricePerHour, image } = req.body;

    const updated = await Turf.findByIdAndUpdate(
      id,
      { name, location, pricePerHour, image },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Turf not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update turf" });
  }
};

const addReview = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }

    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment required" });
    }

    // ✅ Include required `user` field
    const review = {
      user: req.user._id, // This is REQUIRED by schema
      name: req.user.name || "User", // Optional fallback
      rating: Number(rating),
      comment,
    };

    turf.reviews.push(review);

    // Recalculate average rating
    turf.averageRating =
      turf.reviews.reduce((acc, r) => acc + r.rating, 0) / turf.reviews.length;

    await turf.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error("Error in addReview:", err.message, err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { addTurf, getTurfs, deleteTurf, updateTurf, addReview };
