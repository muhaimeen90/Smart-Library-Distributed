// Database seeder utility for User Service
const { User } = require('../models');

/**
 * Seeds the database with initial user data
 */
const seedDatabase = async () => {
  try {
    console.log('Checking if user database needs seeding...');
    
    // Check if users table is empty
    const userCount = await User.count();
    
    if (userCount === 0) {
      console.log('Seeding users table...');
      
      await User.bulkCreate([
        {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'student'
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'faculty'
        },
        {
          name: 'Admin User',
          email: 'admin@library.com',
          role: 'admin'
        }
      ]);
      
      console.log('Users table seeded successfully');
    } else {
      console.log(`Users table already contains ${userCount} records, skipping seeding`);
    }
  } catch (error) {
    console.error('Error seeding user database:', error);
  }
};

module.exports = { seedDatabase };
