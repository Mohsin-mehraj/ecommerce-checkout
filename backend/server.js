require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Import middleware
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://ecommerce-checkout-w68p-p1n0s4tc0-mohsin-mehrajs-projects.vercel.app",
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Welcome message for root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to E-Commerce API",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      orders: "/api/orders",
    },
    features: {
      transactionSimulation: "Card ending in 1=Approved, 2=Declined, 3=Error",
      inventoryManagement: "Real-time stock tracking and updates",
      orderProcessing: "Complete order lifecycle management",
      emailNotifications: "Mailtrap integration for order emails",
    },
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Only start server if not in Vercel environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;
