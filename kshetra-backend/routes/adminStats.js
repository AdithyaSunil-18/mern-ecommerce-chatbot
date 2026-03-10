import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/", adminAuth, async (req, res) => {
  const products = await Product.countDocuments();
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalAmount" } } }
  ]);

  res.json({
    products,
    users,
    orders,
    revenue: revenueData[0]?.total || 0,
  });
});

export default router;