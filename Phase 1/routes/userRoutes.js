const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/users', userController.registerUser);

// Get user by ID
router.get('/users/:id', userController.getUserById);

// Update user profile
router.put('/users/:id', userController.updateUser);

// Stats route that was moved from statsController
// Get most active users
router.get('/stats/users/active', userController.getActiveUsers);

module.exports = router;
