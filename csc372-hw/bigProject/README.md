<!--
  Name: Benjamin Woods
  Date: 05.05.2025
  CSC 372-01
-->
# Tech Store E-Commerce

## Overview
Tech Store is a full-stack JavaScript e-commerce demo.
The back end is built with Node.js, Express, and SQLite; the front end uses plain HTML,
CSS, and vanilla JavaScript to consume the REST API.

## Tech Stack
- **Runtime & framework:** Node.js, Express.js
- **Database:** SQLite (`sqlite3`, `better-sqlite3`)
- **File uploads:** Multer
- **Front end:** HTML5, CSS3, Vanilla JavaScript

## Third-Party API
- **Advice Slip JSON API**: fetches a random advice slip on the home page
  (`https://api.adviceslip.com/advice`)

## Installation
1. Clone this repo and navigate into the project directory:
   ```bash
   git clone https://github.com/quintusManus/CSC372-BigProject.git
   cd csc372-hw/bigProject
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Database Setup
1. Create the database and schema:
   ```bash
   sqlite3 db/ecommerce.db < db/create_tables.sql
   ```
2. Load initial data:
   ```bash
   sqlite3 db/ecommerce.db < db/insert_categories.sql
   sqlite3 db/ecommerce.db < db/insert_products.sql
   ```
3. To reset:
   ```bash
   sqlite3 db/ecommerce.db < db/drop_tables.sql
   ```

## Running the App
Start the server (defaults to port 3000):
```bash
npm start
# or
node server.js
# or (if installed)
nodemon server.js
```
Open your browser to `http://localhost:3000`.

## API Endpoints

### Health Check
- GET `/api/health`
  ```json
  { "status": "OK", "time": "<ISO timestamp>" }
  ```

### Products
- GET `/api/products`  
  List all products.
- GET `/api/products/:id`  
  Get product by ID.
- GET `/api/products/search?q=<keyword>`  
  Search products by name or category.
- POST `/api/products` *(admin)*  
  Create a new product. JSON body example:
  ```json
  {
    "name": "New GPU",
    "description": "Powerful GPU",
    "image_url": "images/gpu.png",
    "price": 699.99,
    "category_id": 1
  }
  ```
- PUT `/api/products/:id` *(admin)*  
  Update an existing product. Accepts the same JSON fields.

### Categories
- GET `/api/categories`  
  List all categories.

### Carts
- GET `/api/carts/user/:userId`  
  Retrieve or create a cart for a user.
- GET `/api/carts/:cartId`  
  Get cart details (includes items).
- POST `/api/carts/:cartId/products`  
  Add a product to a cart. JSON body example:
  ```json
  {
    "productId": 2,
    "quantity": 1
  }
  ```
- DELETE `/api/carts/:cartId/products/:cartProductId`  
  Remove an item from the cart.
- POST `/api/carts/:cartId/checkout`  
  Checkout the cart (marks as purchased & clears items).

### Users
- POST `/api/users`  
  Create a new user (shopper or admin). JSON body example:
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "Secret123",
    "user_type": "shopper"
  }
  ```
- GET `/api/users/:id`  
  Retrieve user by ID.
- PUT `/api/users/:id`  
  Update user record (e.g., name, password).

## Front-End
Static pages and assets are in `public/`:
- `index.html` — Home page (featured products & random advice)
- `products.html` — Browse & search products
- `details.html` — Product detail view
- `cart.html` — Shopping cart
- `admin-products.html`, `product-edit.html`, `admin-upload.html` — Basic admin interface
- CSS in `public/styles`, JS in `public/scripts`, images in `public/images`

## Database Schema
See `db/schema-diagram.png` for the ER diagram.  
Table definitions and sample data are in `db/*.sql`.
