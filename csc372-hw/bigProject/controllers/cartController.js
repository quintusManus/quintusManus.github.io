/**
 * controllers/cartController.js
 * Business logic for cart endpoints. Calls cartModel for data access.
 */
const cartModel = require('../models/cartModel');

async function getOrCreateCart(req, res) {
  try {
    const userId = parseInt(req.params.userId, 10);
    const cart = await cartModel.getOrCreateCart(userId);
    res.json(cart);
  } catch (err) {
    console.error('Error in getOrCreateCart:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getCartDetails(req, res) {
  try {
    const cartId = parseInt(req.params.cartId, 10);
    const cart = await cartModel.getCartDetails(cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    console.error('Error in getCartDetails:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function addItemToCart(req, res) {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;
    const rowId = await cartModel.addProductToCart(
      parseInt(cartId, 10),
      parseInt(productId, 10),
      parseInt(quantity, 10) || 1
    );
    res.status(201).json({ cart_product_id: rowId });
  } catch (err) {
    console.error('Error in addItemToCart:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function removeItemFromCart(req, res) {
  try {
    const { cartProductId } = req.params;
    const changes = await cartModel.removeProductFromCart(parseInt(cartProductId, 10));
    if (changes === 0) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error in removeItemFromCart:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function checkoutCart(req, res) {
  try {
    const cartId = parseInt(req.params.cartId, 10);
    await cartModel.checkoutCart(cartId);
    res.json({ success: true });
  } catch (err) {
    console.error('Error in checkoutCart:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getOrCreateCart,
  getCartDetails,
  addItemToCart,
  removeItemFromCart,
  checkoutCart
};