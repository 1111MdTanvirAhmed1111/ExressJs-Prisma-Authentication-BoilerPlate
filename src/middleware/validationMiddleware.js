const Joi = require('joi');
const { errorHandler } = require('@/utils/errorHandler'); // Assuming you’ll add this utility

// Validation middleware factory function
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    // Select the source of data to validate (body, query, params)
    const data = req[source];
    
    // Validate data against the provided schema
    const { error } = schema.validate(data, {
      abortEarly: false, // Report all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
      allowUnknown: false, // Disallow unknown fields by default
    });

    if (error) {
      // Format error details into a readable message
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      const validationError = new Error(`Validation failed: ${errorMessages}`);
      validationError.status = 400;
      return next(validationError);
    }

    // If validation passes, proceed to the next middleware
    next();
  };
};

// Example schemas for your routes
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
    }),
    name: Joi.string().max(50).optional().messages({
      'string.max': 'Name cannot exceed 50 characters',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
    }),
  }),

  sendMessage: Joi.object({
    receiverId: Joi.number().integer().positive().required().messages({
      'number.base': 'Receiver ID must be a number',
      'number.integer': 'Receiver ID must be an integer',
      'number.positive': 'Receiver ID must be positive',
      'any.required': 'Receiver ID is required',
    }),
    content: Joi.string().min(1).max(500).required().messages({
      'string.min': 'Message content must be at least 1 character',
      'string.max': 'Message content cannot exceed 500 characters',
      'any.required': 'Message content is required',
    }),
  }),

  uploadFile: Joi.object({
    // No body validation needed for file uploads since Multer handles it,
    // but you could validate query params or additional fields if needed
  }),
};

// Export the middleware and schemas
module.exports = {
  validate,
  schemas,
};