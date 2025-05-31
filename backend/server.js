const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Test products route
app.get("/api/products", (req, res) => {
  res.json({
    success: true,
    data: [{ id: 1, title: "Test Product", price: 99.99 }],
  });
});

// Test orders route
app.post("/api/orders", (req, res) => {
  res.json({
    success: true,
    message: "Order test endpoint working",
  });
});

module.exports = app;
