import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  stock: Number,
  description: String,

  brand: String,
  gender: {
    type: String,
    enum: ["men", "women", "unisex"],
    default: "unisex",
  },

  colors: [String],
  sizes: [String],

  style: [String], // casual, formal, streetwear
  season: [String], // summer, winter

  sold: {
    type: Number,
    default: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);