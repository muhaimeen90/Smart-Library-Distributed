const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Database configuration
const { sequelize, testConnection } = require('./config/database');

// Import routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const loanRoutes = require('./routes/loanRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// API routes
app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', loanRoutes);

// Root route for API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Smart Library System API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
const startServer = async () => {
  try {    // Test database connection
    await testConnection();    
    
    // Sync all models with the database - using force:false to preserve data
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully');
    
    // Seed the database with initial data if needed
    const { seedDatabase } = require('./utils/dbSeeder');
    await seedDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();