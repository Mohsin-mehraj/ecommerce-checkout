const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  validateCheckoutForm,
  handleValidationErrors,
} = require("../middleware/validation");

// POST /api/orders - Create new order (checkout)
router.post(
  "/",
  validateCheckoutForm,
  handleValidationErrors,
  orderController.createOrder
);

// POST /api/orders/clear-session - Clear session for new order
router.post("/clear-session", orderController.clearSession);

// GET /api/orders/:orderNumber - Get order by order number
router.get("/:orderNumber", orderController.getOrderByNumber);

module.exports = router;
