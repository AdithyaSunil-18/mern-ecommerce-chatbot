import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();


// ✅ CREATE ORDER

// ✅ CREATE ORDER
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: "Order creation failed" });
  }
});


// ✅ GET USER ORDERS
router.get("/my-orders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  res.json(orders);
});


// ✅ DELETE ORDER
router.delete("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // only owner can delete
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;