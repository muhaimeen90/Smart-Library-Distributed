// Book Controller for Book Service
const { Book } = require('../models');
const { Op } = require('sequelize');

// Add a new book
const addBook = async (req, res) => {
  try {
    const { title, author, isbn, copies } = req.body;
    
    // Check if book with same ISBN already exists
    const existingBook = await Book.findOne({ where: { isbn } });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    
    // Create book
    const book = await Book.create({
      title,
      author,
      isbn,
      copies,
      available_copies: copies // Initially all copies are available
    });
    
    return res.status(201).json(book);
  } catch (error) {
    console.error('Error adding book:', error);
    return res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

// Search for books
const searchBooks = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // If search parameter is provided, search in title, author, and isbn
    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
          { isbn: { [Op.like]: `%${search}%` } }
        ]
      };
    }
    
    // Get books
    const { count, rows: books } = await Book.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.status(200).json({
      books,
      total: count,
      page: parseInt(page),
      per_page: parseInt(limit)
    });
  } catch (error) {
    console.error('Error searching books:', error);
    return res.status(500).json({ message: 'Error searching books', error: error.message });
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
    console.error('Error getting book:', error);
    return res.status(500).json({ message: 'Error getting book', error: error.message });
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, copies } = req.body;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if ISBN is being changed and if so, if it's already in use
    if (isbn && isbn !== book.isbn) {
      const existingBookWithISBN = await Book.findOne({ where: { isbn } });
      if (existingBookWithISBN) {
        return res.status(400).json({ message: 'ISBN already in use' });
      }
    }
    
    // Update book fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    
    // Handle copies update
    if (copies !== undefined) {
      const copiesDiff = copies - book.copies;
      book.copies = copies;
      // Also update available copies
      book.available_copies += copiesDiff;
    }
    
    await book.save();
    
    return res.status(200).json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    return res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Update book availability
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { operation, available_copies } = req.body;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Handle different operations
    if (operation === 'increment') {
      book.available_copies += 1;
    } else if (operation === 'decrement') {
      if (book.available_copies <= 0) {
        return res.status(400).json({ message: 'No available copies to decrement' });
      }
      book.available_copies -= 1;
    } else if (available_copies !== undefined) {
      // Direct update
      if (available_copies > book.copies) {
        return res.status(400).json({ 
          message: `Available copies cannot exceed total copies (${book.copies})` 
        });
      }
      book.available_copies = available_copies;
    } else {
      return res.status(400).json({ 
        message: 'Either operation (increment/decrement) or available_copies must be provided' 
      });
    }
    
    await book.save();
    
    return res.status(200).json({
      id: book.id,
      available_copies: book.available_copies,
      updated_at: book.updated_at
    });
  } catch (error) {
    console.error('Error updating book availability:', error);
    return res.status(500).json({ 
      message: 'Error updating book availability', 
      error: error.message 
    });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if there are no outstanding loans (all copies available)
    if (book.available_copies < book.copies) {
      return res.status(400).json({ 
        message: 'Cannot delete book with outstanding loans' 
      });
    }
    
    await book.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    return res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};

module.exports = {
  addBook,
  searchBooks,
  getBookById,
  updateBook,
  updateAvailability,
  deleteBook
};
