const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const {
  validateProductStock,
  handleValidationErrors,
} = require("../middleware/validation");

// GET  - Get all products
router.get("/", productController.getAllProducts);

// GET  - Get single product by ID
router.get("/:id", productController.getProductById);

// POST  - Check stock availability
router.post(
  "/:id/check-stock",
  validateProductStock,
  handleValidationErrors,
  productController.checkStock
);

module.exports = router;
