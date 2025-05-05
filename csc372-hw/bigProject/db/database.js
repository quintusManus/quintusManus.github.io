/**
 * db/database.js
 *
 * Provides a singleton SQLite database connection using `sqlite3`.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite DB:', err);
  } else {
    console.log('Connected to SQLite DB:', dbPath);
  }
});

module.exports = db;