// User Service Routes
const express = require('express');
const userController = require('../controllers/userController');
const { validate, userSchemas } = require('../middleware/validate');
const router = express.Router();

// Create a new user
router.post('/users', validate(userSchemas.createUser), userController.createUser);

// Get user by ID
router.get('/users/:id', userController.getUserById);

// Update user
router.put('/users/:id', validate(userSchemas.updateUser), userController.updateUser);

module.exports = router;
