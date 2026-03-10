import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

mongoose.connect("mongodb://127.0.0.1:27017/kshetra");

const createAdmin = async () => {
  const existing = await User.findOne({ email: "admin@kshetra.com" });

  if (existing) {
    console.log("Admin already exists ✅");
    process.exit();
  }

  const hashed = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Admin",
    email: "admin@kshetra.com",
    password: hashed,
    role: "admin",
  });

  console.log("Admin created 🚀");
  process.exit();
};

createAdmin();