const { Book } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// Add a new book
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, copies } = req.body;
    
    // Check if book with ISBN already exists
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    
    // Create new book with available copies equal to total copies
    const book = await Book.create({
      title,
      author,
      isbn,
      copies: copies || 1,
      available_copies: copies || 1
    });
    
    return res.status(201).json(book);
  } catch (error) {
    console.error('Error adding book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Search books
const searchBooks = async (req, res) => {
  try {
    const { query, search } = req.query;
    const searchTerm = query || search;
    
    if (!searchTerm) {
      const books = await Book.findAll();
      return res.status(200).json(books);
    }
    
    const searchResults = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { author: { [Op.like]: `%${searchTerm}%` } },
          { isbn: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });
    
    return res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error searching books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, copies, available_copies } = req.body;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Update book details
    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (copies !== undefined) book.copies = copies;
    if (available_copies !== undefined) book.available_copies = available_copies;
    
    await book.save();
    
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    await book.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get most popular books
const getPopularBooks = async (req, res) => {
  try {
    // Use loanController service instead of direct Loan model access
    const loanController = require('./loanController');
    const popularBooksResult = await loanController.getPopularBooks_service();
    
    if (!popularBooksResult.success) {
      return res.status(popularBooksResult.status || 500).json({ 
        message: popularBooksResult.message || 'Error getting popular books' 
      });
    }
    
    const popularBooks = popularBooksResult.data;
    
    const formattedBooks = popularBooks.map(item => ({
      book_id: item.book_id,
      title: item.Book.title,
      author: item.Book.author,
      borrow_count: parseInt(item.dataValues.borrow_count)
    }));
    
    return res.status(200).json(formattedBooks);
  } catch (error) {
    console.error('Error getting popular books:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get system overview statistics
const getSystemOverview = async (req, res) => {
  try {
    // Book statistics - can be handled directly here
    const totalBooks = await Book.sum('copies');
    const booksAvailable = await Book.sum('available_copies');
    const booksBorrowed = totalBooks - booksAvailable;
    
    // Get user count from userController service
    const userController = require('./userController');
    const userCountResult = await userController.getUserCount_service();
    if (!userCountResult.success) {
      return res.status(userCountResult.status || 500).json({ 
        message: userCountResult.message || 'Error getting user count' 
      });
    }
    const totalUsers = userCountResult.data;
    
    // Get loan statistics from loanController service
    const loanController = require('./loanController');
    const loanStatsResult = await loanController.getLoanStatistics_service();
    if (!loanStatsResult.success) {
      return res.status(loanStatsResult.status || 500).json({ 
        message: loanStatsResult.message || 'Error getting loan statistics' 
      });
    }
    
    const { loansToday, returnsToday, overdueLoans } = loanStatsResult.data;
    
    return res.status(200).json({
      total_books: totalBooks,
      total_users: totalUsers,
      books_available: booksAvailable,
      books_borrowed: booksBorrowed,
      overdue_loans: overdueLoans,
      loans_today: loansToday,
      returns_today: returnsToday
    });
  } catch (error) {
    console.error('Error getting system overview:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getBookByISBN = async (isbn) => {
  try {
    const book = await Book.findOne({ where: { isbn } });
    return book;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw error;
  }
};

// Service method to get book by ID
const getBookById_service = async (id) => {
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return { success: false, message: 'Book not found', status: 404 };
    }
    return { success: true, data: book };
  } catch (error) {
    console.error('Error finding book by ID:', error);
    return { success: false, message: 'Error finding book', error, status: 500 };
  }
};

// Service method to update book availability
const updateBookAvailability = async (id, increment = true) => {
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return { success: false, message: 'Book not found', status: 404 };
    }
    
    if (increment) {
      book.available_copies += 1;
    } else {
      if (book.available_copies <= 0) {
        return { success: false, message: 'No available copies of this book', status: 400 };
      }
      book.available_copies -= 1;
    }
    
    await book.save();
    return { success: true, data: book };
  } catch (error) {
    console.error('Error updating book availability:', error);
    return { success: false, message: 'Error updating book availability', error, status: 500 };
  }
};

module.exports = {
  addBook,
  getBookById,
  searchBooks,
  updateBook,
  deleteBook,
  getPopularBooks,
  getSystemOverview,
  getBookById_service,
  updateBookAvailability
};
