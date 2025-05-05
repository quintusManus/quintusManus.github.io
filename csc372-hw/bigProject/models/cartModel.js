/**
 * models/cartModel.js
 * Methods to interact with `carts` and `cart_products` tables.
 */
const db = require('../db/database');

/**
 * Get or create cart for a user (assuming one cart per user).
 * @param {number} userId
 * @return {Promise<object>} cart row
 */
function getOrCreateCart(userId) {
  return new Promise((resolve, reject) => {
    // First check if cart exists
    const sqlCheck = `SELECT * FROM carts WHERE user_id = ?`;
    db.get(sqlCheck, [userId], (err, row) => {
      if (err) return reject(err);

      if (row) {
        // cart exists
        resolve(row);
      } else {
        // create new cart
        const createdAt = new Date().toISOString();
        const sqlInsert = `
          INSERT INTO carts (user_id, status, created_at)
          VALUES (?, 'new', ?)
        `;
        db.run(sqlInsert, [userId, createdAt], function (err2) {
          if (err2) return reject(err2);
          const newCartId = this.lastID;
          // return newly created cart row
          db.get(`SELECT * FROM carts WHERE id = ?`, [newCartId], (err3, row2) => {
            if (err3) return reject(err3);
            resolve(row2);
          });
        });
      }
    });
  });
}

/**
 * Get cart details including products for a given cartId.
 * @param {number} cartId
 * @return {Promise<object>} cart info + items array
 */
function getCartDetails(cartId) {
  return new Promise((resolve, reject) => {
    const sqlCart = `SELECT * FROM carts WHERE id = ?`;
    db.get(sqlCart, [cartId], (err, cartRow) => {
      if (err) return reject(err);
      if (!cartRow) return resolve(null);

      // get cart_products
      const sqlItems = `
        SELECT cp.id as cart_product_id, cp.product_id, cp.quantity,
               p.name, p.price, p.image_url
        FROM cart_products cp
        JOIN products p ON cp.product_id = p.id
        WHERE cp.cart_id = ?
      `;
      db.all(sqlItems, [cartId], (err2, items) => {
        if (err2) return reject(err2);
        resolve({
          ...cartRow,
          items
        });
      });
    });
  });
}

/**
 * Add or update product in cart.
 * @param {number} cartId
 * @param {number} productId
 * @param {number} quantity
 * @return {Promise<number>} cart_products.id of updated/inserted row
 */
function addProductToCart(cartId, productId, quantity) {
  return new Promise((resolve, reject) => {
    // check if product already in cart
    const sqlCheck = `
      SELECT * FROM cart_products
      WHERE cart_id = ? AND product_id = ?
    `;
    db.get(sqlCheck, [cartId, productId], (err, row) => {
      if (err) return reject(err);

      if (row) {
        // update quantity
        const newQty = row.quantity + quantity;
        const sqlUpdate = `
          UPDATE cart_products
          SET quantity = ?
          WHERE id = ?
        `;
        db.run(sqlUpdate, [newQty, row.id], function (err2) {
          if (err2) return reject(err2);
          resolve(row.id);
        });
      } else {
        // insert new row
        const sqlInsert = `
          INSERT INTO cart_products (cart_id, product_id, quantity)
          VALUES (?, ?, ?)
        `;
        db.run(sqlInsert, [cartId, productId, quantity], function (err3) {
          if (err3) return reject(err3);
          resolve(this.lastID);
        });
      }
    });
  });
}

/**
 * Remove a product from the cart.
 * @param {number} cartProductId - cart_products row ID
 * @return {Promise<number>} number of rows deleted
 */
function removeProductFromCart(cartProductId) {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cart_products WHERE id = ?`;
    db.run(sql, [cartProductId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

/**
 * Checkout cart - sets cart status to 'purchased' and empties items (optional approach).
 * @param {number} cartId
 * @return {Promise<boolean>} success
 */
function checkoutCart(cartId) {
  return new Promise((resolve, reject) => {
    // set status to 'purchased'
    const sqlUpdate = `UPDATE carts SET status = 'purchased' WHERE id = ?`;
    db.run(sqlUpdate, [cartId], function (err) {
      if (err) return reject(err);
      // optionally clear items
      const sqlDeleteItems = `DELETE FROM cart_products WHERE cart_id = ?`;
      db.run(sqlDeleteItems, [cartId], function (err2) {
        if (err2) return reject(err2);
        resolve(true);
      });
    });
  });
}

module.exports = {
  getOrCreateCart,
  getCartDetails,
  addProductToCart,
  removeProductFromCart,
  checkoutCart
};