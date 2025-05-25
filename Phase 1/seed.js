// Manual database seeder script
const { seedDatabase } = require('./utils/dbSeeder');
const { sequelize } = require('./config/database');
const { testConnection } = require('./config/database');

const runSeed = async () => {
  try {
    // Test database connection
    await testConnection();

    // Check for force reset flag
    const forceReset = process.argv.includes('--force');
    
    if (forceReset) {
      console.log('FORCE RESET MODE: Dropping all tables and recreating...');
      await sequelize.sync({ force: true });
      console.log('Database schema reset completed');
    }
    
    // Seed the database
    await seedDatabase();
    
    console.log('Manual database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();
