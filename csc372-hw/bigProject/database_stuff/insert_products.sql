--
-- insert_products.sql
--
-- Insert sample products referencing the categories created earlier.
--

INSERT INTO products (name, description, image_url, price, category_id)
VALUES (
  'RTX 5070',
  'High-performance GPU for gaming',
  'images/rtx5070.png',
  499.99,
  1  -- references "Graphics Cards"
);

INSERT INTO products (name, description, image_url, price, category_id)
VALUES (
  'Core i9 Processor',
  'Flagship Intel processor for extreme performance',
  'images/intel_i9.png',
  599.99,
  2  -- references "CPUs"
);

INSERT INTO products (name, description, image_url, price, category_id)
VALUES (
  'Mechanical Keyboard',
  'Tactile switches, RGB lighting, durable design',
  'images/mech_kb.png',
  89.99,
  3  -- references "Accessories"
);

INSERT INTO products (name, description, image_url, price, category_id)
VALUES (
  'Ultra Gaming Laptop',
  'High-end laptop with dedicated GPU and fast CPU',
  'images/gaming_laptop.png',
  1499.99,
  4  -- references "Laptops"
);