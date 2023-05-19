const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getAllProducts,
} = require("../controllers/productController");
const { protect } = require("../middlewares/jwtMiddleware");
const router = express.Router();

router.post("/create", protect, createProduct);
router.patch("/update/:id", protect, updateProduct);
router.delete("/delete/:id", protect, deleteProduct);
router.get("/:id", protect, getSingleProduct);
router.get("/", protect, getAllProducts);

module.exports = router;
