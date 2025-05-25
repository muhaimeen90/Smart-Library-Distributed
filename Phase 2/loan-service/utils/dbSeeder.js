// Database seeder utility for Loan Service
const { Loan } = require('../models');

/**
 * Seeds the database with initial loan data if needed
 * Note: No initial loan data is seeded as loans depend on user and book IDs
 * from their respective services
 */
const seedDatabase = async () => {
  try {
    console.log('Checking if loan database needs seeding...');
    
    // Check if loans table is empty
    const loanCount = await Loan.count();
    
    if (loanCount === 0) {
      console.log('Loans table is empty, but no initial seed data is provided');
      console.log('Loans will be created when users issue books');
    } else {
      console.log(`Loans table already contains ${loanCount} records`);
    }
  } catch (error) {
    console.error('Error checking loan database:', error);
  }
};

module.exports = { seedDatabase };
