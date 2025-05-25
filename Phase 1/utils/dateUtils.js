/**
 * Utility functions for date operations
 */

// Format date to ISO string
const formatDate = (date) => {
  return date.toISOString();
};

// Check if a date is past due
const isPastDue = (dueDate) => {
  const now = new Date();
  return new Date(dueDate) < now;
};

// Calculate days between two dates
const daysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

module.exports = {
  formatDate,
  isPastDue,
  daysBetween,
  addDays
};
