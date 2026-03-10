import express from "express";
import Product from "../models/Product.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/* =========================
   IMAGE UPLOAD
========================= */
router.post(
  "/upload",
  adminAuth,
  upload.single("image"),
  (req, res) => {
    res.json({ imageUrl: req.file.filename });
  }
);

/* =========================
   ADD PRODUCT
========================= */
/* ADD PRODUCT */
router.post("/", upload.single("image"), async (req, res) => {
  const { name, price, category, description, stock } = req.body;

  const product = new Product({
    name,
    price,
    category,
    description,
    stock,
    image: req.file?.filename,
  });

  await product.save();
  res.json(product);
});


// GET ACTIVE PRODUCTS ONLY
router.get("/", adminAuth, async (req, res) => {
  const products = await Product.find({ isDeleted: false });
  res.json(products);
});
/* =========================
   UPDATE PRODUCT
========================= */
/* UPDATE PRODUCT */
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, price, category, description, stock } = req.body;

  const updated = {
    name,
    price,
    category,
    description,
    stock,
  };

  if (req.file) updated.image = req.file.filename;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    updated,
    { new: true }
  );

  res.json(product);
});

/* =========================
   DELETE PRODUCT
========================= */
// SOFT DELETE PRODUCT
router.delete("/:id", adminAuth, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
  });

  res.json({ message: "Product moved to trash" });
});
// GET DELETED PRODUCTS (TRASH)
router.get("/deleted", adminAuth, async (req, res) => {
  const products = await Product.find({ isDeleted: true });
  res.json(products);
});
// RESTORE product
router.put("/restore/:id", adminAuth, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    isDeleted: false,
  });
  res.json({ message: "Product restored" });
});
export default router;