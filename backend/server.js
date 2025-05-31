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

module.exports = app;
