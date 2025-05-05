/**
 * Name: Benjamin Woods
 * Date: 04.06.2025
 * CSC 372-01
 *
 * server.js:
 * Main entry point for the Express server. It serves static files from `public`
 * and sets up routes for products, carts, admin, etc.
 */

const express = require("express");
const path = require("path");

// Routes
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from `public`
app.use(express.static(path.join(__dirname, "public")));

// Mount route modules at /api endpoints
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/users", userRoutes);
// Categories endpoints
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

// Basic test route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
