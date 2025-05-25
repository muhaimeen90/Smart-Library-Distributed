// Database seeder utility for Book Service
const { Book } = require('../models');

/**
 * Seeds the database with initial book data
 */
const seedDatabase = async () => {
  try {
    console.log('Checking if book database needs seeding...');
    
    // Check if books table is empty
    const bookCount = await Book.count();
    
    if (bookCount === 0) {
      console.log('Seeding books table...');
      
      await Book.bulkCreate([
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          isbn: '9780132350884',
          copies: 3,
          available_copies: 3
        },
        {
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          isbn: '9780134494166',
          copies: 2,
          available_copies: 2
        },
        {
          title: 'Design Patterns',
          author: 'Erich Gamma',
          isbn: '9780201633610',
          copies: 4,
          available_copies: 4
        },
        {
          title: 'The Pragmatic Programmer',
          author: 'Andrew Hunt',
          isbn: '9780201616224',
          copies: 5,
          available_copies: 5
        },
        {
          title: 'Refactoring',
          author: 'Martin Fowler',
          isbn: '9780201485677',
          copies: 2,
          available_copies: 2
        }
      ]);
      
      console.log('Books table seeded successfully');
    } else {
      console.log(`Books table already contains ${bookCount} records, skipping seeding`);
    }
  } catch (error) {
    console.error('Error seeding book database:', error);
  }
};

module.exports = { seedDatabase };
