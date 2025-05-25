// Database seeder utility to populate initial data
const { User, Book, Loan } = require('../models');
const { sequelize } = require('../config/database');

/**
 * Seeds the database with initial data if tables are empty
 */
const seedDatabase = async () => {
  try {
    console.log('Checking if database needs seeding...');
    
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
    }
    
    // Check if books table is empty
    const bookCount = await Book.count();
    if (bookCount === 0) {
      console.log('Seeding books table...');
      await Book.bulkCreate([
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          isbn: '9780743273565',
          copies: 5,
          available_copies: 5
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          isbn: '9780061120084',
          copies: 3,
          available_copies: 3
        },
        {
          title: '1984',
          author: 'George Orwell',
          isbn: '9780451524935',
          copies: 4,
          available_copies: 4
        },
        {
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          isbn: '9780316769488',
          copies: 3,
          available_copies: 3
        },
        {
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          isbn: '9780141439518',
          copies: 2,
          available_copies: 2
        }
      ]);
      console.log('Books table seeded successfully');
    }
      // Optional: Seed some initial loans
    const loanCount = await Loan.count();
    if (loanCount === 0) {
      console.log('Seeding users table...');
      // Create users first
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
      
      console.log('Seeding books table...');
      // Create books
      await Book.bulkCreate([
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          isbn: '9780743273565',
          copies: 5,
          available_copies: 5
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          isbn: '9780061120084',
          copies: 3,
          available_copies: 3
        }
      ]);
      
      // Get user and book IDs
      const users = await User.findAll();
      const books = await Book.findAll();
      
      // Only create loans if we have users and books
      if (users.length > 0 && books.length > 0) {
        console.log('Seeding loans table...');
        
        // Create a loan 7 days ago with 14-day term (active)
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 7);
        
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        
        // Create an overdue loan
        const overdueDate = new Date();
        overdueDate.setDate(overdueDate.getDate() - 30);
        
        const overdueDueDate = new Date();
        overdueDueDate.setDate(overdueDueDate.getDate() - 10);
        
        await Loan.bulkCreate([
          {
            user_id: users[0].id,
            book_id: books[0].id,
            issue_date: pastDate,
            due_date: dueDate,
            status: 'ACTIVE',
            extensions_count: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            user_id: users[1].id,
            book_id: books[1].id,
            issue_date: overdueDate,
            due_date: overdueDueDate,
            status: 'ACTIVE',
            extensions_count: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
        
        // Update available copies for the loaned books
        await Book.update(
          { available_copies: sequelize.literal('available_copies - 1') },
          { where: { id: books[0].id } }
        );
        
        await Book.update(
          { available_copies: sequelize.literal('available_copies - 1') },
          { where: { id: books[1].id } }
        );
        
        console.log('Loans table seeded successfully');
      }
    }
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
