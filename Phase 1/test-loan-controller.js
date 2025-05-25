// This is a test script to verify our changes to the loanController
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const loanController = require('./controllers/loanController');
const { User, Book, Loan } = require('./models');

async function testLoanControllerChanges() {
  console.log('Testing loanController restructuring...');
  
  try {
    // 1. Test getUserById_service
    console.log('\n1. Testing getUserById_service:');
    const userId = 1;
    const userResult = await userController.getUserById_service(userId);
    console.log(`  User service result for ID ${userId}:`, userResult.success ? 'Success' : 'Failed');
    if (!userResult.success) {
      console.log(`  Error: ${userResult.message}`);
    } else {
      console.log(`  Found user: ${userResult.data.name}`);
    }
    
    // 2. Test getBookById_service
    console.log('\n2. Testing getBookById_service:');
    const bookId = 1;
    const bookResult = await bookController.getBookById_service(bookId);
    console.log(`  Book service result for ID ${bookId}:`, bookResult.success ? 'Success' : 'Failed');
    if (!bookResult.success) {
      console.log(`  Error: ${bookResult.message}`);
    } else {
      console.log(`  Found book: ${bookResult.data.title} by ${bookResult.data.author}`);
    }
    
    // 3. Test updateBookAvailability
    console.log('\n3. Testing updateBookAvailability:');
    // First get current availability
    const book = await Book.findByPk(bookId);
    const initialAvailability = book.available_copies;
    console.log(`  Initial availability for book ID ${bookId}: ${initialAvailability}`);
    
    // Decrement availability
    const decrementResult = await bookController.updateBookAvailability(bookId, false);
    if (decrementResult.success) {
      console.log(`  Decreased availability to: ${decrementResult.data.available_copies}`);
    } else {
      console.log(`  Error decreasing availability: ${decrementResult.message}`);
    }
    
    // Increment availability back
    const incrementResult = await bookController.updateBookAvailability(bookId, true);
    if (incrementResult.success) {
      console.log(`  Increased availability to: ${incrementResult.data.available_copies}`);
    } else {
      console.log(`  Error increasing availability: ${incrementResult.message}`);
    }
    
    // Verify we're back to the initial state
    const updatedBook = await Book.findByPk(bookId);
    console.log(`  Final availability: ${updatedBook.available_copies}`);
    if (initialAvailability === updatedBook.available_copies) {
      console.log('  ✅ Availability properly restored');
    } else {
      console.log('  ❌ Availability not restored correctly');
    }
    
    console.log('\nTests completed successfully!');
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the tests
testLoanControllerChanges().then(() => {
  console.log('Testing completed.');
  process.exit(0);
}).catch(err => {
  console.error('Testing failed:', err);
  process.exit(1);
});
