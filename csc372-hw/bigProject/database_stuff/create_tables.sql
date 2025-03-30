-- 
-- create_tables.sql
-- 
-- Run this script in SQLite to create the ecommerce tables in the correct order.
--

/* 1) CATEGORIES */
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  priority_level INTEGER DEFAULT 0
);

/* 2) USERS */
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  user_type TEXT NOT NULL
  -- e.g., 'admin' or 'shopper'
);

/* 3) PRODUCTS */
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price REAL NOT NULL,
  category_id INTEGER NOT NULL,
  -- e.g., an extra column if you track "featured" or "promoted" status
  -- featured INTEGER DEFAULT 0,

  FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

/* 4) CARTS */
CREATE TABLE IF NOT EXISTS carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,  
  -- If each user can only have one cart at a time, use UNIQUE on user_id
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);

/* 5) CART_PRODUCTS */
CREATE TABLE IF NOT EXISTS cart_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,

  FOREIGN KEY (cart_id) REFERENCES carts (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  FOREIGN KEY (product_id) REFERENCES products (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
);