const mongoose = require("mongoose");

// 👇 Sub-schema for reviews
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,

  rating: {
    type: Number,
    required: true,
  },
  comment: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },

  // 👇 Add this reviews field
  reviews: [reviewSchema],
  averageRating: Number,
});

module.exports = mongoose.model("Turf", turfSchema);
