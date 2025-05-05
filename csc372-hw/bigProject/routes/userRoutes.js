/**
 * routes/userRoutes.js
 * Defines routes for user endpoints (create user, get user, update user).
 */
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/users - create user
router.post('/', userController.createUser);

// GET /api/users/:id
router.get('/:id', userController.getUser);

// PUT /api/users/:id
router.put('/:id', userController.updateUser);

module.exports = router;