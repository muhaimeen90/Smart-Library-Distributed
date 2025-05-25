const { Loan } = require('../models');
const { Op } = require('sequelize');
const userController = require('./userController');
const bookController = require('./bookController');

const issueBook = async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    
    const userResult = await userController.getUserById_service(user_id);
    if (!userResult.success) {
      return res.status(userResult.status).json({ message: userResult.message });
    }
    
    const bookResult = await bookController.getBookById_service(book_id);
    if (!bookResult.success) {
      return res.status(bookResult.status).json({ message: bookResult.message });
    }
    
    const updateResult = await bookController.updateBookAvailability(book_id, false);
    if (!updateResult.success) {
      return res.status(updateResult.status).json({ message: updateResult.message });
    }
    
    const loan = await Loan.create({
      user_id,
      book_id,
      issue_date: new Date(),
      due_date: due_date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
      status: 'ACTIVE'
    });
    
    return res.status(201).json(loan);
  } catch (error) {
    console.error('Error issuing book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const returnBook = async (req, res) => {
  try {
    const { loan_id } = req.body;
    
  
    const loan = await Loan.findByPk(loan_id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan record not found' });
    }
    
    if (loan.status === 'RETURNED') {
      return res.status(400).json({ message: 'Book already returned' });
    }
    
    loan.return_date = new Date();
    loan.status = 'RETURNED';
    await loan.save();
    
    // Increment available copies through bookController
    const updateResult = await bookController.updateBookAvailability(loan.book_id, true);
    if (!updateResult.success) {
      return res.status(updateResult.status).json({ 
        message: updateResult.message,
        note: 'Loan was marked as returned, but there was an error updating book availability'
      });
    }
    
    return res.status(200).json(loan);
  } catch (error) {
    console.error('Error returning book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user loan history
const getUserLoans = async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // Check if user exists using userController
    const userResult = await userController.getUserById_service(user_id);
    if (!userResult.success) {
      return res.status(userResult.status).json({ message: userResult.message });
    }
      // Get all loans for the user with book details
    const loans = await Loan.findAll({
      where: { user_id },
      include: [{
        model: require('../models').Book,
        attributes: ['id', 'title', 'author']
      }]
    });
    
    // Format response
    const formattedLoans = loans.map(loan => ({
      id: loan.id,
      book: {
        id: loan.Book.id,
        title: loan.Book.title,
        author: loan.Book.author
      },
      issue_date: loan.issue_date,
      due_date: loan.due_date,
      return_date: loan.return_date,
      status: loan.status
    }));
    
    return res.status(200).json(formattedLoans);
  } catch (error) {
    console.error('Error fetching user loans:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get overdue loans
const getOverdueLoans = async (req, res) => {
  try {
    const currentDate = new Date();
      const overdueLoans = await Loan.findAll({
      where: {
        due_date: { [Op.lt]: currentDate },
        status: 'ACTIVE'
      },
      include: [
        { model: require('../models').User, attributes: ['id', 'name', 'email'] },
        { model: require('../models').Book, attributes: ['id', 'title', 'author'] }
      ]
    });
    
    // Format response with days overdue
    const formattedOverdueLoans = overdueLoans.map(loan => {
      const daysOverdue = Math.floor((currentDate - loan.due_date) / (1000 * 60 * 60 * 24));
      
      return {
        id: loan.id,
        user: {
          id: loan.User.id,
          name: loan.User.name,
          email: loan.User.email
        },
        book: {
          id: loan.Book.id,
          title: loan.Book.title,
          author: loan.Book.author
        },
        issue_date: loan.issue_date,
        due_date: loan.due_date,
        days_overdue: daysOverdue
      };
    });
    
    return res.status(200).json(formattedOverdueLoans);
  } catch (error) {
    console.error('Error fetching overdue loans:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Extend loan due date
const extendLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { extension_days } = req.body;
    
    if (!extension_days || extension_days <= 0) {
      return res.status(400).json({ message: 'Extension days must be greater than 0' });
    }
    
    // Find the loan
    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (loan.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Cannot extend a returned or overdue loan' });
    }
    
    // Store original due date
    const originalDueDate = new Date(loan.due_date);
    
    // Calculate new due date
    const newDueDate = new Date(loan.due_date);
    newDueDate.setDate(newDueDate.getDate() + extension_days);
    
    // Update loan
    loan.due_date = newDueDate;
    loan.extensions_count += 1;
    await loan.save();
    
    // Return formatted response
    return res.status(200).json({
      id: loan.id,
      user_id: loan.user_id,
      book_id: loan.book_id,
      issue_date: loan.issue_date,
      original_due_date: originalDueDate,
      extended_due_date: loan.due_date,
      status: loan.status,
      extensions_count: loan.extensions_count
    });
  } catch (error) {
    console.error('Error extending loan:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const findAllLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll();
    return res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching all loans:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getLoansToday = async (req, res) => {
  try {
    const today = new Date();
    const loans = await Loan.findAll({
      where: {
        issue_date: {
          [Op.gte]: new Date(today.setHours(0, 0, 0, 0)),
          [Op.lte]: new Date(today.setHours(23, 59, 59, 999))
        }
      }
    });
    return res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching loans for today:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getReturnsToday = async (req, res) => {
  try {
    const today = new Date();
    const returns = await Loan.findAll({
      where: {
        return_date: {
          [Op.gte]: new Date(today.setHours(0, 0, 0, 0)),
          [Op.lte]: new Date(today.setHours(23, 59, 59, 999))
        }
      }
    });
    return res.status(200).json(returns);
  } catch (error) {
    console.error('Error fetching returns for today:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Service method to get active loans with user details
const getActiveLoans_service = async () => {
  try {
    const loans = await Loan.findAll({
      where: { status: 'ACTIVE' },
      include: [{
        model: require('../models').User,
        attributes: ['id', 'name']
      }],
      raw: true
    });
    return { success: true, data: loans };
  } catch (error) {
    console.error('Error fetching active loans:', error);
    return { success: false, message: 'Error fetching active loans', error, status: 500 };
  }
};

// Service method to get popular books for bookController
const getPopularBooks_service = async () => {
  try {
    const { sequelize } = require('../config/database');
    const popularBooks = await Loan.findAll({
      attributes: [
        'book_id',
        [sequelize.fn('COUNT', sequelize.col('book_id')), 'borrow_count']
      ],
      include: [{
        model: require('../models').Book,
        attributes: ['title', 'author']
      }],
      group: ['book_id'],
      order: [[sequelize.literal('borrow_count'), 'DESC']],
      limit: 10
    });
    
    return { success: true, data: popularBooks };
  } catch (error) {
    console.error('Error getting popular books:', error);
    return { success: false, message: 'Error getting popular books', error, status: 500 };
  }
};

// Service method to get loan statistics for bookController
const getLoanStatistics_service = async () => {
  try {
    const { Op } = require('sequelize');
    
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Count loans made today
    const loansToday = await Loan.count({
      where: {
        issue_date: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });
    
    // Count returns made today
    const returnsToday = await Loan.count({
      where: {
        return_date: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      }
    });
    
    // Count overdue loans
    const overdueLoans = await Loan.count({
      where: {
        due_date: { [Op.lt]: new Date() },
        status: 'ACTIVE'
      }
    });
    
    return { 
      success: true, 
      data: {
        loansToday,
        returnsToday,
        overdueLoans
      }
    };
  } catch (error) {
    console.error('Error getting loan statistics:', error);
    return { success: false, message: 'Error getting loan statistics', error, status: 500 };
  }
};

module.exports = {
  issueBook,
  returnBook,
  getUserLoans,
  getOverdueLoans,
  extendLoan,
  findAllLoans,
  getLoansToday,
  getReturnsToday,
  getActiveLoans_service,
  getPopularBooks_service,
  getLoanStatistics_service
};
