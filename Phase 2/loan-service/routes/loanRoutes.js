// Loan Service Routes
const express = require('express');
const loanController = require('../controllers/loanController');
const { validate, loanSchemas } = require('../middleware/validate');
const router = express.Router();

// Issue a book
router.post('/loans', validate(loanSchemas.issueBook), loanController.issueBook);

// Return a book
router.post('/returns', validate(loanSchemas.returnBook), loanController.returnBook);

// Get user loans
router.get('/loans/user/:user_id', loanController.getUserLoans);

// Get loan by ID
router.get('/loans/:id', loanController.getLoanById);

module.exports = router;
