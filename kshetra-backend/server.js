import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
// DB
import connectDB from "./config/db.js";

// Routes
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/adminDashboard.js";
import adminProducts from "./routes/adminProducts.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import adminStats from "./routes/adminStats.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";



dotenv.config();

const app = express();

// ✅ connect database
connectDB();

// ✅ middleware
app.use(cors());
app.use(express.json());

// ⭐ serve uploaded images
app.use("/uploads", express.static("uploads"));

// ✅ routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/products", adminProducts);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/stats", adminStats);
app.use("/api/chatbot", chatbotRoutes);

// ✅ test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// ✅ start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);