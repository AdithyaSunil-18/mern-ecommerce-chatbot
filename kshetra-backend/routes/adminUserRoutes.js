import express from "express";
import User from "../models/User.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

/* GET ALL USERS */
router.get("/", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;