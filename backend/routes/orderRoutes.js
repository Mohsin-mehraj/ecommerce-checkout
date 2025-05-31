const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  validateCheckoutForm,
  handleValidationErrors,
} = require("../middleware/validation");

// POST - Create new order (checkout)
router.post(
  "/",
  validateCheckoutForm,
  handleValidationErrors,
  orderController.createOrder
);

// POST  - Clear session for new order
router.post("/clear-session", orderController.clearSession);

// GET - Get order by order number
router.get("/:orderNumber", orderController.getOrderByNumber);

module.exports = router;
