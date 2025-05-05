/**
 * routes/cartRoutes.js
 * Defines routes for cart endpoints: get/create cart, add/remove items, checkout
 */
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET/POST cart for user: /api/carts/user/:userId
router.get('/user/:userId', cartController.getOrCreateCart);

// GET cart details: /api/carts/:cartId
router.get('/:cartId', cartController.getCartDetails);

// POST add item to cart: /api/carts/:cartId/products
router.post('/:cartId/products', cartController.addItemToCart);

// DELETE remove item from cart: /api/carts/:cartId/products/:cartProductId
router.delete('/:cartId/products/:cartProductId', cartController.removeItemFromCart);

// POST checkout: /api/carts/:cartId/checkout
router.post('/:cartId/checkout', cartController.checkoutCart);

module.exports = router;