// Book Service Main Application
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Database configuration
const { sequelize, testConnection } = require('./config/database');

// Import routes
const bookRoutes = require('./routes/bookRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8082;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/', bookRoutes);

// Root route for API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Book Service API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
      // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
    
    // Seed the database with initial data
    const { seedDatabase } = require('./utils/dbSeeder');
    await seedDatabase();
    
    // Start the server
    app.listen(PORT,'0.0.0.0',() => {
      console.log(`Book Service running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
