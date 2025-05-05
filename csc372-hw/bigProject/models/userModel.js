/**
 * models/userModel.js
 * Methods to interact with `users` table.
 */
const db = require('../db/database');

/**
 * Create a new user (shopper or admin).
 * @param {object} userData
 * @return {Promise<number>} newly inserted user ID
 */
function createUser({ name, email, password, user_type }) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO users (created_at, updated_at, name, email, password, user_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [now, now, name, email, password, user_type],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

/**
 * Get user by ID.
 * @param {number} userId
 * @return {Promise<object>} user record or null
 */
function getUserById(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

/**
 * Update user record (e.g., change password, name).
 * @param {number} userId
 * @param {object} data
 * @return {Promise<number>} number of rows updated
 */
function updateUser(userId, data) {
  const { name, email, password, user_type } = data;
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    const sql = `
      UPDATE users
      SET updated_at = ?, name = ?, email = ?, password = ?, user_type = ?
      WHERE id = ?
    `;
    db.run(sql, [now, name, email, password, user_type, userId], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

module.exports = {
  createUser,
  getUserById,
  updateUser
};