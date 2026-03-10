import express from "express";
import multer from "multer";
import Product from "../models/product.js";

const router = express.Router();

/* ============================
   📦 Multer Storage Config
============================ */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ============================
   ➕ Add Product
============================ */

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      image: req.file ? req.file.filename : null,
      stock: req.body.stock || 0,
      isDeleted: false,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   📦 Get ALL Products
============================ */

router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); // returns ALL products
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   📦 Get ACTIVE Products (for website)
============================ */

router.get("/active", async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   📦 Get DELETED Products
============================ */

router.get("/deleted", async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   🔍 Get SINGLE Product
============================ */

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   ❌ Soft Delete Product
============================ */

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   ♻ Restore Product
============================ */

router.put("/restore/:id", async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
    });

    res.json({ message: "Product restored successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;