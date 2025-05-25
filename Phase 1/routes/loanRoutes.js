const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Issue a book to a user
router.post('/loans', loanController.issueBook);

// Return a borrowed book
router.post('/returns', loanController.returnBook);

// Get overdue loans
router.get('/loans/overdue', loanController.getOverdueLoans);

// Get user loan history
router.get('/loans/:user_id', loanController.getUserLoans);

// Extend loan due date
router.put('/loans/:id/extend', loanController.extendLoan);

module.exports = router;
