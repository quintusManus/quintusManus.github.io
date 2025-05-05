/**
 * controllers/userController.js
 * Business logic for user endpoints. Calls userModel for data access.
 */
const userModel = require('../models/userModel');

async function createUser(req, res) {
  try {
    const { name, email, password, user_type } = req.body;
    // minimal validation
    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newId = await userModel.createUser({ name, email, password, user_type });
    res.status(201).json({ userId: newId });
  } catch (err) {
    console.error('Error in createUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUser(req, res) {
  try {
    const userId = parseInt(req.params.id, 10);
    const changes = await userModel.updateUser(userId, req.body);
    if (changes === 0) {
      return res.status(404).json({ error: 'No user updated' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Error in updateUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createUser,
  getUser,
  updateUser
};