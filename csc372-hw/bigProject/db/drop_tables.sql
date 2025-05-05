--
-- drop_tables.sql
--
-- Removes all tables in reverse dependency order.
--

DROP TABLE IF EXISTS cart_products;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;