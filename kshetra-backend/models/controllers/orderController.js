import Order from "../models/Order.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.product", "image");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};