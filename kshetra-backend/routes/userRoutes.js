import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ==============================
// GET USER PROFILE
// ==============================
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==============================
// UPDATE PROFILE
// ==============================
router.put("/update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ==============================
// ADD ADDRESS
// ==============================
// ✅ ADD ADDRESS
router.post("/address", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(req.body); // push full address object

    await user.save();

    res.json({ addresses: user.addresses });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add address" });
  }
});


// ✅ DELETE ADDRESS
router.delete("/address/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.id
    );

    await user.save();

    res.json({ addresses: user.addresses });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});


// ==============================
// ADD MONEY TO WALLET
// ==============================
router.post("/wallet/add", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const amount = Number(req.body.amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    user.wallet += amount;

    await user.save();

    res.json({ wallet: user.wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;