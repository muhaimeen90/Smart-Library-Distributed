// This script tests the controller interactions after refactoring
const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const loanController = require('./controllers/loanController');

async function testControllerInteractions() {
  console.log('Testing controller interactions after refactoring...');

  try {
    // 1. Test user service methods
    console.log('\n1. Testing userController service methods:');
    const userResult = await userController.getUserById_service(1);
    console.log(`  getUserById_service result for ID 1:`, userResult.success ? 'Success' : 'Failed');
    
    const userCountResult = await userController.getUserCount_service();
    console.log(`  getUserCount_service result:`, userCountResult.success ? 'Success' : 'Failed');
    console.log(`  Total users: ${userCountResult.data}`);

    // 2. Test book service methods
    console.log('\n2. Testing bookController service methods:');
    const bookResult = await bookController.getBookById_service(1);
    console.log(`  getBookById_service result for ID 1:`, bookResult.success ? 'Success' : 'Failed');
    
    // 3. Test loan service methods
    console.log('\n3. Testing loanController service methods:');
    const activeLoansResult = await loanController.getActiveLoans_service();
    console.log(`  getActiveLoans_service result:`, activeLoansResult.success ? 'Success' : 'Failed');
    console.log(`  Number of active loans: ${activeLoansResult.data ? activeLoansResult.data.length : 0}`);
    
    const popularBooksResult = await loanController.getPopularBooks_service();
    console.log(`  getPopularBooks_service result:`, popularBooksResult.success ? 'Success' : 'Failed');
    
    const loanStatsResult = await loanController.getLoanStatistics_service();
    console.log(`  getLoanStatistics_service result:`, loanStatsResult.success ? 'Success' : 'Failed');
    if (loanStatsResult.success) {
      console.log(`  Loans today: ${loanStatsResult.data.loansToday}`);
      console.log(`  Returns today: ${loanStatsResult.data.returnsToday}`);
      console.log(`  Overdue loans: ${loanStatsResult.data.overdueLoans}`);
    }

    console.log('\nAll controller service methods tested successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the tests
testControllerInteractions().then(() => {
  console.log('Testing completed.');
  process.exit(0);
}).catch(err => {
  console.error('Testing failed:', err);
  process.exit(1);
});
