/**
 * routes/productRoutes.js
 * Defines Express routes for product endpoints: GET, POST, PUT, etc.
 */
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products
router.get('/', productController.listAllProducts);

// GET /api/products/search?q=...
router.get('/search', productController.searchProducts);

// GET /api/products/:id
router.get('/:id', productController.getProduct);

// POST /api/products (admin to create product)
router.post('/', productController.createNewProduct);

// PUT /api/products/:id (admin to update)
router.put('/:id', productController.updateProduct);
// DELETE /api/products/:id (admin to delete)
router.delete('/:id', productController.deleteProduct);

// You can add DELETE if needed
// router.delete('/:id', productController.deleteProduct);

module.exports = router;