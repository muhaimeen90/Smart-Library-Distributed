// User Controller for User Service
const { User } = require('../models');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      role
    });
    
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({ message: 'Error getting user', error: error.message });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is being changed and if so, if it's already in use
    if (email && email !== user.email) {
      const existingUserWithEmail = await User.findOne({ where: { email } });
      if (existingUserWithEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    await user.save();
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser
};
