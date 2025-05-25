// Loan Controller for Loan Service
const { Loan } = require('../models');
const { userService, bookService } = require('../utils/serviceClients');

// Issue a book
const issueBook = async (req, res) => {
  try {
    const { user_id, book_id, due_date } = req.body;
    
    // Verify user exists
    try {
      await userService.get(`/users/${user_id}`);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return res.status(404).json({ message: 'User not found' });
        }
      }
      
      return res.status(503).json({ 
        message: 'User Service unavailable', 
        error: error.message 
      });
    }
    
    // Verify book exists and has available copies
    let book;
    try {
      const bookResponse = await bookService.get(`/books/${book_id}`);
      book = bookResponse.data;
      
      if (book.available_copies <= 0) {
        return res.status(400).json({ message: 'No available copies of this book' });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return res.status(404).json({ message: 'Book not found' });
        }
      }
      
      return res.status(503).json({ 
        message: 'Book Service unavailable', 
        error: error.message 
      });
    }
    
    // Update book availability
    try {
      await bookService.patch(`/books/${book_id}/availability`, {
        operation: 'decrement'
      });
    } catch (error) {
      return res.status(503).json({ 
        message: 'Failed to update book availability', 
        error: error.message 
      });
    }
    
    // Create loan
    const loan = await Loan.create({
      user_id,
      book_id,
      issue_date: new Date(),
      due_date: new Date(due_date),
      status: 'ACTIVE'
    });
    
    return res.status(201).json(loan);
  } catch (error) {
    console.error('Error issuing book:', error);
    return res.status(500).json({ message: 'Error issuing book', error: error.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const { loan_id } = req.body;
    
    // Find the loan
    const loan = await Loan.findByPk(loan_id);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    
    if (loan.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Book already returned' });
    }
    
    // Update loan record
    loan.return_date = new Date();
    loan.status = 'RETURNED';
    await loan.save();
      // Update book availability
    try {
      await bookService.patch(`/books/${loan.book_id}/availability`, {
        operation: 'increment'
      });
    } catch (error) {
      console.error('Failed to update book availability:', error);
      // Continue with the return process even if book update fails
      // We'll still return a success response but log the error
    }
    
    return res.status(200).json(loan);
  } catch (error) {
    console.error('Error returning book:', error);
    return res.status(500).json({ message: 'Error returning book', error: error.message });
  }
};

// Get user loans
const getUserLoans = async (req, res) => {
  try {
    const { user_id } = req.params;
      // Verify user exists
    try {
      await userService.get(`/users/${user_id}`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Continue even if user service is unavailable
      console.error('User service error:', error.message);
    }
    
    // Get all loans for the user
    const loans = await Loan.findAll({
      where: { user_id },
      order: [['issue_date', 'DESC']]
    });
    
    // Enhance loan records with book details
    const enhancedLoans = [];
    for (const loan of loans) {
      try {
        const bookResponse = await bookService.get(`/books/${loan.book_id}`);
        const book = bookResponse.data;
        
        enhancedLoans.push({
          id: loan.id,
          book: {
            id: book.id,
            title: book.title,
            author: book.author
          },
          issue_date: loan.issue_date,
          due_date: loan.due_date,
          return_date: loan.return_date,
          status: loan.status
        });
      } catch (error) {
        // Include the loan even if book service is unavailable
        enhancedLoans.push({
          id: loan.id,
          book: {
            id: loan.book_id,
            title: 'Book information unavailable',
            author: 'Unknown'
          },
          issue_date: loan.issue_date,
          due_date: loan.due_date,
          return_date: loan.return_date,
          status: loan.status
        });
      }
    }
    
    return res.status(200).json({
      loans: enhancedLoans,
      total: loans.length
    });
  } catch (error) {
    console.error('Error getting user loans:', error);
    return res.status(500).json({ message: 'Error getting user loans', error: error.message });
  }
};

// Get loan details
const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const loan = await Loan.findByPk(id);
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
      // Get user details
    let user = { id: loan.user_id };
    try {
      const userResponse = await userService.get(`/users/${loan.user_id}`);
      user = {
        id: userResponse.data.id,
        name: userResponse.data.name,
        email: userResponse.data.email
      };
    } catch (error) {
      console.error('User service error:', error.message);
      // Continue with limited user info
    }
      // Get book details
    let book = { id: loan.book_id };
    try {
      const bookResponse = await bookService.get(`/books/${loan.book_id}`);
      book = {
        id: bookResponse.data.id,
        title: bookResponse.data.title,
        author: bookResponse.data.author
      };
    } catch (error) {
      console.error('Book service error:', error.message);
      // Continue with limited book info
    }
    
    const loanDetails = {
      id: loan.id,
      user,
      book,
      issue_date: loan.issue_date,
      due_date: loan.due_date,
      return_date: loan.return_date,
      status: loan.status
    };
    
    return res.status(200).json(loanDetails);
  } catch (error) {
    console.error('Error getting loan details:', error);
    return res.status(500).json({ message: 'Error getting loan details', error: error.message });
  }
};

module.exports = {
  issueBook,
  returnBook,
  getUserLoans,
  getLoanById
};
