const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const turfRoutes = require("./routes/turfRoutes");
app.use("/api/turfs", turfRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

const uploadRoutes = require("./routes/upload");
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server started on port 5000"));
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Turf Booking Website 🛤️</h1>");
});
