// This script tests the complete loan flow using our updated controllers
const axios = require('axios');
const baseURL = 'http://localhost:3000';

async function testLoanFlow() {
  try {
    console.log('Testing complete loan flow...');
    let response;

    // 1. Get a user and book to use for testing
    console.log('\n1. Getting user and book data...');
    response = await axios.get(`${baseURL}/api/users/1`);
    const user = response.data;
    console.log(`  Found user: ${user.name} (ID: ${user.id})`);

    response = await axios.get(`${baseURL}/api/books?query=gatsby`);
    const book = response.data[0];
    console.log(`  Found book: ${book.title} (ID: ${book.id})`);

    // 2. Issue a book to the user
    console.log('\n2. Issuing book to user...');
    response = await axios.post(`${baseURL}/api/loans`, {
      user_id: user.id,
      book_id: book.id,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });
    const loan = response.data;
    console.log(`  Loan created with ID: ${loan.id}`);
    console.log(`  Book issued to user: ${user.name}`);
    console.log(`  Due date: ${new Date(loan.due_date).toLocaleDateString()}`);

    // 3. Get user's loans
    console.log('\n3. Getting user loans...');
    response = await axios.get(`${baseURL}/api/loans/${user.id}`);
    const loans = response.data;
    console.log(`  User has ${loans.length} loans`);
    
    const recentLoan = loans.find(l => l.id === loan.id);
    if (recentLoan) {
      console.log(`  Found our recent loan: ${recentLoan.book.title}`);
    }

    // 4. Extend the loan
    console.log('\n4. Extending loan due date...');
    response = await axios.put(`${baseURL}/api/loans/${loan.id}/extend`, {
      extension_days: 7
    });
    const extendedLoan = response.data;
    console.log(`  Original due date: ${new Date(extendedLoan.original_due_date).toLocaleDateString()}`);
    console.log(`  Extended due date: ${new Date(extendedLoan.extended_due_date).toLocaleDateString()}`);

    // 5. Return the book
    console.log('\n5. Returning the book...');
    response = await axios.post(`${baseURL}/api/returns`, {
      loan_id: loan.id
    });
    const returnedLoan = response.data;
    console.log(`  Book returned. Status: ${returnedLoan.status}`);
    console.log(`  Return date: ${new Date(returnedLoan.return_date).toLocaleDateString()}`);

    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Error during testing:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Function to run tests
async function runTests() {
  console.log('Make sure the server is running on http://localhost:3000');
  
  setTimeout(async () => {
    try {
      await testLoanFlow();
      console.log('All tests completed.');
    } catch (err) {
      console.error('Test failed:', err);
    }
  }, 1000); // Wait 1 second before starting tests
}

runTests();
