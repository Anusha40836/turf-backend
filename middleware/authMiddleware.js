const jwt = require("jsonwebtoken");

const User = require("../models/User");
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // ✅ Fetch full user

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ Attach full user to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied: Admins only" });
  next();
};

module.exports = { verifyToken, isAdmin };
