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

// Loan validation schemas
const loanSchemas = {
  issueBook: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    book_id: Joi.number().integer().positive().required(),
    due_date: Joi.date().iso().required().min(new Date())
  }),
  
  returnBook: Joi.object({
    loan_id: Joi.number().integer().positive().required()
  })
};

module.exports = {
  validate,
  loanSchemas
};
