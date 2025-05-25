// Smart Library System - Microservices Testing Script
const axios = require('axios');

// Service URLs
const userServiceUrl = 'http://localhost:8081';
const bookServiceUrl = 'http://localhost:8082';
const loanServiceUrl = 'http://localhost:8083';

// Test Data
const timestamp = Date.now();
const testUser = {
  name: 'Test User',
  email: `testuser${timestamp}@example.com`, // Add timestamp to make email unique
  role: 'student'
};

const testBook = {
  title: 'Test Book',
  author: 'Test Author',
  isbn: `${timestamp}123`, // Use timestamp for ISBN too to make it unique
  copies: 5
};

// Global variables to store created entities IDs
let userId, bookId, loanId;

// Helper functions
const log = (message) => {
  console.log(`\x1b[36m${message}\x1b[0m`);
};

const logSuccess = (message) => {
  console.log(`\x1b[32m✓ ${message}\x1b[0m`);
};

const logError = (error) => {
  console.error(`\x1b[31m✗ Error: ${error.message}\x1b[0m`);
  if (error.response) {
    console.error(`  Status: ${error.response.status}`);
    console.error(`  Data:`, error.response.data);
  }
};

// Test functions
async function testUserService() {
  log('\n=== Testing User Service ===');
  
  try {
    // Test root endpoint
    log('\nTesting User Service root endpoint...');
    const rootResponse = await axios.get(userServiceUrl);
    logSuccess(`Root endpoint: ${JSON.stringify(rootResponse.data)}`);
    
    // Create a user
    log('\nCreating a test user...');
    const createUserResponse = await axios.post(`${userServiceUrl}/users`, testUser);
    userId = createUserResponse.data.id;
    logSuccess(`User created with ID: ${userId}`);
    
    // Get user by ID
    log('\nGetting user by ID...');
    const getUserResponse = await axios.get(`${userServiceUrl}/users/${userId}`);
    logSuccess(`User retrieved: ${getUserResponse.data.name}`);
    
    // Update user
    log('\nUpdating user...');
    const updatedUserResponse = await axios.put(`${userServiceUrl}/users/${userId}`, {
      name: 'Updated Test User'
    });
    logSuccess(`User updated: ${updatedUserResponse.data.name}`);
    
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
}

async function testBookService() {
  log('\n=== Testing Book Service ===');
  
  try {
    // Test root endpoint
    log('\nTesting Book Service root endpoint...');
    const rootResponse = await axios.get(bookServiceUrl);
    logSuccess(`Root endpoint: ${JSON.stringify(rootResponse.data)}`);
    
    // Add a book
    log('\nAdding a test book...');
    const addBookResponse = await axios.post(`${bookServiceUrl}/books`, testBook);
    bookId = addBookResponse.data.id;
    logSuccess(`Book added with ID: ${bookId}`);
    
    // Get book by ID
    log('\nGetting book by ID...');
    const getBookResponse = await axios.get(`${bookServiceUrl}/books/${bookId}`);
    logSuccess(`Book retrieved: ${getBookResponse.data.title}`);
    
    // Search for books
    log('\nSearching for books...');
    const searchResponse = await axios.get(`${bookServiceUrl}/books?search=Test`);
    logSuccess(`Books found: ${searchResponse.data.books.length}`);
    
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
}

async function testLoanService() {
  log('\n=== Testing Loan Service ===');
  
  try {
    // Test root endpoint
    log('\nTesting Loan Service root endpoint...');
    const rootResponse = await axios.get(loanServiceUrl);
    logSuccess(`Root endpoint: ${JSON.stringify(rootResponse.data)}`);
      // Issue a book
    log('\nIssuing a book...');
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); 
    
    const issueBookResponse = await axios.post(`${loanServiceUrl}/loans`, {
      user_id: userId,
      book_id: bookId,
      due_date: dueDate.toISOString().split('T')[0]
    });
    loanId = issueBookResponse.data.id;
    logSuccess(`Book issued with loan ID: ${loanId}`);
    
    // Get loans by user ID
    log('\nGetting loans by user ID...');
    const userLoansResponse = await axios.get(`${loanServiceUrl}/loans/user/${userId}`);
    logSuccess(`Loans found for user: ${userLoansResponse.data.length}`);
      // Return the book
    log('\nReturning the book...');
    const returnBookResponse = await axios.post(`${loanServiceUrl}/returns`, {
      loan_id: loanId
    });
    logSuccess(`Book returned: ${returnBookResponse.data.status}`);
    
    return true;
  } catch (error) {
    logError(error);
    return false;
  }
}

// Main test function
async function runTests() {
  log('\n🔍 SMART LIBRARY SYSTEM - MICROSERVICES TESTING');
  log('=================================================');
  
  const userServiceOk = await testUserService();
  const bookServiceOk = await testBookService();
  let loanServiceOk = false;
  
  if (userServiceOk && bookServiceOk) {
    loanServiceOk = await testLoanService();
  } else {
    log('\n⚠️  Skipping Loan Service tests because User or Book service tests failed');
  }
  
  // Print summary
  log('\n=================================================');
  log('TEST SUMMARY');
  log('=================================================');
  log(`User Service: ${userServiceOk ? '✅ PASSED' : '❌ FAILED'}`);
  log(`Book Service: ${bookServiceOk ? '✅ PASSED' : '❌ FAILED'}`);
  log(`Loan Service: ${loanServiceOk ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (userServiceOk && bookServiceOk && loanServiceOk) {
    log('\n✅ All tests passed! The microservices are working correctly.');
  } else {
    log('\n❌ Some tests failed. Please check the logs for details.');
  }
}

// Run the tests
runTests().catch(err => {
  console.error('Critical error running tests:', err);
});
