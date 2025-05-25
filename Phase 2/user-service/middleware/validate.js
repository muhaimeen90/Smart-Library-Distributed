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

// User validation schemas
const userSchemas = {
  createUser: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('student', 'faculty', 'admin').default('student')
  }),
  
  updateUser: Joi.object({
    name: Joi.string(),
    email: Joi.string().email()
  }).min(1)
};

module.exports = {
  validate,
  userSchemas
};
