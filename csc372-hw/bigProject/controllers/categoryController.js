/**
 * controllers/categoryController.js
 * Business logic for category endpoints.
 */
const categoryModel = require('../models/categoryModel');

async function listCategories(req, res) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (err) {
    console.error('Error in listCategories:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  listCategories,
};