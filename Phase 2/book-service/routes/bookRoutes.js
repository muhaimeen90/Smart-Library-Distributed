// Book Service Routes
const express = require('express');
const bookController = require('../controllers/bookController');
const { validate, bookSchemas } = require('../middleware/validate');
const router = express.Router();

// Add a new book
router.post('/books', validate(bookSchemas.addBook), bookController.addBook);

// Search for books
router.get('/books', bookController.searchBooks);

// Get book by ID
router.get('/books/:id', bookController.getBookById);

// Update book
router.put('/books/:id', validate(bookSchemas.updateBook), bookController.updateBook);

// Update book availability
router.patch('/books/:id/availability', validate(bookSchemas.updateAvailability), bookController.updateAvailability);

// Delete book
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;
