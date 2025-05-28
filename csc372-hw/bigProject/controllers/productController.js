/**
 * controllers/productController.js
 * Business logic for product endpoints. Calls productModel for data access.
 */
const productModel = require('../models/productModel');

async function listAllProducts(req, res) {
  try {
    // Allows optional filtering by category via query param: /api/products?category=<id>
    const { category } = req.query;
    let products;
    if (category) {
      const categoryId = parseInt(category, 10);
      products = await productModel.getProductsByCategory(categoryId);
    } else {
      products = await productModel.getAllProducts();
    }
    res.json(products);
  } catch (err) {
    console.error('Error in listAllProducts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error in getProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function searchProducts(req, res) {
  try {
    const { q } = req.query; // e.g. /api/products/search?q=keyboard
    if (!q) {
      return res.json([]); // no query? return empty
    }
    const results = await productModel.searchProducts(q);
    res.json(results);
  } catch (err) {
    console.error('Error in searchProducts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function createNewProduct(req, res) {
  try {
    const { name, description, image_url, price, category_id } = req.body;
    // (Add validation as needed)
    const newId = await productModel.createProduct({
      name,
      description,
      image_url,
      price,
      category_id
    });
    res.status(201).json({ productId: newId });
  } catch (err) {
    console.error('Error in createNewProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const changes = await productModel.updateProduct(Number(id), req.body);
    if (changes === 0) {
      return res.status(404).json({ error: 'No product updated' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error in updateProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function deleteProduct(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const changes = await productModel.deleteProduct(id);
    if (changes === 0) {
      return res.status(404).json({ error: 'No product deleted' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  listAllProducts,
  getProduct,
  searchProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
};