import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/product.js";

const router  = express.Router(); 

/* ================= ADMIN LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Not authorized" });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      admin: { name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ADMIN AUTH MIDDLEWARE ================= */
const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

/* ================= USERS ================= */

// ✅ GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("FETCH USERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= ORDERS ================= */

// ✅ GET all orders with full details
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images");

    res.json(orders);
  } catch (error) {
    console.error("FETCH ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE ORDER STATUS + STOCK MANAGEMENT
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    console.log("Updating order:", req.params.id);
    console.log("New status:", status);

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(req.params.id)
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    // ⭐ reduce stock when shipped
    if (status === "Shipped") {
      for (const item of order.items) {
        if (item.product?._id) {
          await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }

    await order.save();

    res.json({
      message: "Status updated successfully",
      order,
    });

  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE ORDER
router.delete("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// GET DASHBOARD ANALYTICS
router.get("/analytics", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;