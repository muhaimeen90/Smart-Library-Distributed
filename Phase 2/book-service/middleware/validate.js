// Request validation middleware
const Joi = require('joi');

// Create validation middleware with provided schema
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Book validation schemas
const bookSchemas = {
  addBook: Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    isbn: Joi.string().required(),
    copies: Joi.number().integer().min(1).default(1)
  }),
  
  updateBook: Joi.object({
    title: Joi.string(),
    author: Joi.string(),
    isbn: Joi.string(),
    copies: Joi.number().integer().min(1)
  }).min(1),
  
  updateAvailability: Joi.object({
    operation: Joi.string().valid('increment', 'decrement'),
    available_copies: Joi.number().integer().min(0)
  }).xor('operation', 'available_copies')
};

module.exports = {
  validate,
  bookSchemas
};
