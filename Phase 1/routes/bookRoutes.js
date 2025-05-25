const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Add a new book
router.post('/books', bookController.addBook);

// Get book by ID
router.get('/books/:id', bookController.getBookById);

// Search books
router.get('/books', bookController.searchBooks);

// Update book information
router.put('/books/:id', bookController.updateBook);

// Delete book
router.delete('/books/:id', bookController.deleteBook);

// Stats routes that were moved from statsController
// Get most popular books
router.get('/stats/books/popular', bookController.getPopularBooks);

// Get system overview statistics
router.get('/stats/overview', bookController.getSystemOverview);

module.exports = router;
