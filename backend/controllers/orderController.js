const fs = require("fs").promises;
const path = require("path");

// Import services with error handling
let fileService, transactionService, emailService, productController;

try {
  fileService = require("../services/fileService");
  transactionService = require("../services/transactionService");
  emailService = require("../services/emailService");
  productController = require("./productController");
} catch (error) {
  console.error("❌ Error loading services:", error.message);
}

// Generate unique order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const time = String(date.getTime()).slice(-5);

  const orderNumber = `ORD-${year}${month}${day}-${time}`;
  console.log(`🆔 Generated order number: ${orderNumber}`);
  return orderNumber;
};

// Get status message based on transaction result
const getStatusMessage = (status) => {
  const messages = {
    approved: "Order placed successfully! Confirmation email sent.",
    declined:
      "Payment was declined. Please check your payment details and try again.",
    error: "Payment system error occurred. Please try again later.",
  };

  return messages[status] || "Order processed.";
};

// Create new order (process checkout)
const createOrder = async (req, res, next) => {
  console.log("🔄 Starting order creation process...");

  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      cardNumber,
      expiryDate,
      cvv,
      productId,
      selectedVariants,
      quantity,
    } = req.body;

    // Validate required fields manually as backup
    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !zipCode
    ) {
      console.log("❌ Missing customer information");
      return res.status(400).json({
        success: false,
        message: "Missing required customer information",
        errors: [
          { field: "general", message: "Please fill in all customer details" },
        ],
      });
    }

    if (!cardNumber || !expiryDate || !cvv) {
      console.log("❌ Missing payment information");
      return res.status(400).json({
        success: false,
        message: "Missing required payment information",
        errors: [
          { field: "general", message: "Please fill in all payment details" },
        ],
      });
    }

    if (!productId || !selectedVariants || !quantity) {
      console.log("❌ Missing product information");
      return res.status(400).json({
        success: false,
        message: "Missing required product information",
        errors: [
          { field: "general", message: "Please select a product and variants" },
        ],
      });
    }

    console.log(`👤 Processing order for: ${fullName} (${email})`);
    console.log(
      `📦 Product: ${productId}, Variants: ${selectedVariants?.join(
        ", "
      )}, Qty: ${quantity}`
    );

    // Get product details with fallback
    let products = [];
    try {
      products = await fileService.readProducts();
    } catch (error) {
      console.error("❌ Error reading products:", error.message);
      return res.status(500).json({
        success: false,
        message: "Error accessing product data",
        errors: [{ field: "general", message: "Please try again later" }],
      });
    }

    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) {
      console.log(`❌ Product not found: ${productId}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: [
          {
            field: "productId",
            message: "Selected product is no longer available",
          },
        ],
      });
    }

    console.log(`✅ Product found: ${product.title}`);

    // Check stock availability
    const variantKey = selectedVariants.join("-");
    const availableStock = product.inventory[variantKey] || 0;

    if (availableStock < quantity) {
      console.log(
        `❌ Insufficient stock: ${availableStock} available, ${quantity} requested`
      );
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${availableStock} items available.`,
        errors: [
          {
            field: "quantity",
            message: `Only ${availableStock} items in stock`,
          },
        ],
      });
    }

    console.log(`✅ Stock available: ${availableStock} >= ${quantity}`);

    // Calculate total
    const subtotal = product.price * quantity;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    console.log(
      `💰 Calculated total: $${total.toFixed(2)} (subtotal: $${subtotal.toFixed(
        2
      )}, tax: $${tax.toFixed(2)})`
    );

    const orderNumber = generateOrderNumber();

    // Process transaction simulation
    let transactionResult;
    try {
      transactionResult = transactionService.processTransaction(cardNumber);
      console.log(`💳 Transaction result: ${transactionResult.status}`);
    } catch (error) {
      console.error("❌ Transaction processing error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Transaction processing error",
        errors: [{ field: "general", message: "Please try again later" }],
      });
    }

    // Create order object
    const order = {
      orderNumber,
      customerInfo: {
        fullName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
      },
      productInfo: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        selectedVariants,
        quantity,
      },
      paymentInfo: {
        cardNumber: transactionService.maskCardNumber(cardNumber),
        expiryDate,
      },
      pricing: {
        subtotal,
        tax,
        total,
      },
      transaction: transactionResult,
      status: transactionResult.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(`📋 Order object created: ${orderNumber}`);

    // Save order with error handling
    try {
      await fileService.addOrder(order);
      console.log(`💾 Order ${orderNumber} saved successfully`);
    } catch (error) {
      console.error("❌ Error saving order:", error.message);
      return res.status(500).json({
        success: false,
        message: "Error saving order",
        errors: [{ field: "general", message: "Please try again later" }],
      });
    }

    // IMPORTANT: Send response FIRST before doing async operations
    console.log(
      `✅ Order ${orderNumber} processed successfully - sending response`
    );

    res.status(201).json({
      success: true,
      message: getStatusMessage(transactionResult.status),
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        transaction: transactionResult,
        total: order.pricing.total,
      },
    });

    // Now do async operations AFTER response is sent
    console.log(
      `🔄 Starting post-response operations for order ${orderNumber}`
    );

    // Update inventory if transaction approved (async, after response)
    if (transactionResult.status === "approved") {
      try {
        await productController.updateInventory(
          parseInt(productId),
          selectedVariants,
          quantity
        );
        console.log(`✅ Inventory updated for order ${orderNumber}`);
      } catch (inventoryError) {
        console.error(
          `❌ Inventory update failed for order ${orderNumber}:`,
          inventoryError.message
        );
        // Don't fail - just log the error
      }
    }

    // Send email notification
    try {
      console.log(`📧 Sending email notification for order ${orderNumber}...`);

      switch (transactionResult.status) {
        case "approved":
          await emailService.sendOrderConfirmation(order);
          console.log(`✅ Confirmation email sent for order ${orderNumber}`);
          break;
        case "declined":
          await emailService.sendDeclinedNotification(order);
          console.log(`📨 Declined email sent for order ${orderNumber}`);
          break;
        case "error":
          await emailService.sendErrorNotification(order);
          console.log(`⚠️ Error email sent for order ${orderNumber}`);
          break;
      }
    } catch (emailError) {
      console.error(
        `❌ Email sending failed for order ${orderNumber}:`,
        emailError.message
      );
      // Don't fail - just log the error
    }

    console.log(`🎉 All operations completed for order ${orderNumber}`);
  } catch (error) {
    console.error("❌ Unexpected error in createOrder:", error);
    console.error("Stack trace:", error.stack);

    // Always return a response to prevent hanging
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        errors: [{ field: "general", message: "Please try again later" }],
      });
    }
  }
};

// Get order by order number
const getOrderByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    console.log(`🔍 Looking for order: ${orderNumber}`);

    const order = await fileService.findOrderByNumber(orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching order",
    });
  }
};

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await fileService.readOrders();
    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

// Clear session
const clearSession = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: "Session cleared for new order",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error clearing session:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing session",
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;

    const orders = await fileService.readOrders();
    const orderIndex = orders.findIndex(
      (order) => order.orderNumber === orderNumber
    );

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    await fileService.writeOrders(orders);

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: orders[orderIndex],
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order status",
    });
  }
};

module.exports = {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  clearSession,
  updateOrderStatus,
};
