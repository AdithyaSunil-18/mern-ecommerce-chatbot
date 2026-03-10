import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ✅ USER REFERENCE
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ ORDER ITEMS
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
          required: true,
        },
        image: String,
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    // ✅ SHIPPING ADDRESS
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // ✅ TOTAL PRICE
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    // ✅ PAYMENT
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paidAt: Date,

    // ✅ ORDER STATUS
    orderStatus: {
      type: String,
      enum: ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed",
    },

    // ✅ DELIVERY & TRACKING
    deliveryDate: Date,      // estimated delivery date
    trackingId: String,      // courier tracking ID
    cancelReason: String,    // reason if cancelled

    // ✅ OUTSTANDING (for COD / partial payments)
    outstandingAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);