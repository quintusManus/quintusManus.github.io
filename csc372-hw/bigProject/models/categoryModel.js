/**
 * models/categoryModel.js
 * Methods to interact with the `categories` table.
 */
const db = require('../db/database');

/**
 * Get all categories.
 * @return {Promise<Array>} array of category objects
 */
function getAllCategories() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM categories ORDER BY priority_level ASC`;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  getAllCategories,
};