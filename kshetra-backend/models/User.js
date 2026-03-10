import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
});

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    phone: String,
    avatar: String,

    wallet: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    addresses: [addressSchema],
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", userSchema);