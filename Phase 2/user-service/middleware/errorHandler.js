// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Default error status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Send the error response
  res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};

module.exports = errorHandler;
