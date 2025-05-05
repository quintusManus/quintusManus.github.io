/**
 * routes/categoryRoutes.js
 * Defines routes for category endpoints.
 */
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories
router.get('/', categoryController.listCategories);

module.exports = router;