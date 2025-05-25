/**
 * Validation schemas using Joi
 */
const Joi = require('joi');

// User validation schema
const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('student', 'faculty', 'admin').default('student')
});

// Book validation schema
const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  isbn: Joi.string().required(),
  copies: Joi.number().integer().min(1).default(1)
});

// Loan validation schema
const loanSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  book_id: Joi.number().integer().required(),
  due_date: Joi.date().iso().min('now')
});

// Return validation schema
const returnSchema = Joi.object({
  loan_id: Joi.number().integer().required()
});

// Loan extension schema
const extensionSchema = Joi.object({
  extension_days: Joi.number().integer().min(1).required()
});

module.exports = {
  userSchema,
  bookSchema,
  loanSchema,
  returnSchema,
  extensionSchema
};
