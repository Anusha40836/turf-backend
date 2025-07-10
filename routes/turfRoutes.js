const express = require("express");
const router = express.Router();
const {
  addTurf,
  getTurfs,
  deleteTurf,
  updateTurf,
  addReview,
} = require("../controllers/turfController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, isAdmin, addTurf);
router.get("/", getTurfs);
router.delete("/:id", verifyToken, isAdmin, deleteTurf);
router.put("/:id", verifyToken, isAdmin, updateTurf);

// ✅ review route (Protected)
router.post("/:id/reviews", verifyToken, addReview);
module.exports = router;
