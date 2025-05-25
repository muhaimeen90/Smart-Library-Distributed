const { User } = require('../models');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = await User.create({ name, email, role });
    
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    await user.save();
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get most active users
const getActiveUsers = async (req, res) => {
  try {
    // Use loanController's service method instead of direct Loan model access
    const loanController = require('./loanController');
    const loansResult = await loanController.getActiveLoans_service();
    
    if (!loansResult.success) {
      return res.status(loansResult.status).json({ message: loansResult.message });
    }
    
    const loans = loansResult.data;
    
    // Count loans per user and find active users
    const userLoanCounts = {};
    const userActiveLoans = {};
    const userNames = {};
    
    loans.forEach(loan => {
      const userId = loan.user_id;
      // Count total loans
      userLoanCounts[userId] = (userLoanCounts[userId] || 0) + 1;
      // Count active loans
      if (loan.status === 'ACTIVE') {
        userActiveLoans[userId] = (userActiveLoans[userId] || 0) + 1;
      }
      // Store user name
      if (loan['User.name']) {
        userNames[userId] = loan['User.name'];
      }
    });
    
    // Convert to array and sort by total loans
    const activeUsers = Object.keys(userLoanCounts).map(userId => ({
      user_id: parseInt(userId),
      name: userNames[userId] || `User ${userId}`,
      books_borrowed: userLoanCounts[userId] || 0,
      current_borrows: userActiveLoans[userId] || 0
    }));
    
    // Sort by most books borrowed
    activeUsers.sort((a, b) => b.books_borrowed - a.books_borrowed);
    
    return res.status(200).json(activeUsers.slice(0, 10)); // Limit to top 10
  } catch (error) {
    console.error('Error getting active users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Service method to get user by ID
const getUserById_service = async (id) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return { success: false, message: 'User not found', status: 404 };
    }
    return { success: true, data: user };
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return { success: false, message: 'Error finding user', error, status: 500 };
  }
};

// Service method to get total user count
const getUserCount_service = async () => {
  try {
    const count = await User.count();
    return { success: true, data: count };
  } catch (error) {
    console.error('Error getting user count:', error);
    return { success: false, message: 'Error getting user count', error, status: 500 };
  }
};

module.exports = {
  registerUser,
  getUserById,
  updateUser,
  getActiveUsers,
  getUserById_service,
  getUserCount_service,
};
