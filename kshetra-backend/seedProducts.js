import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from './models/product.js'
import products from "./Products.js";  
dotenv.config();

// connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("DB Connection Error ❌", error);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    // delete old data (optional)
    await Product.deleteMany();
    console.log("Old products removed");

    // insert new products
    await Product.insertMany(products);
    console.log("✅ 25 KSHESTRA products inserted!");

    process.exit();
  } catch (error) {
    console.error("Seeding Error ❌", error);
    process.exit(1);
  }
};

seedProducts();