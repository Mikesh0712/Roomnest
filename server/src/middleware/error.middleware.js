import { sendError } from '../utils/apiResponse.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Express body-parser payload too large (Buffer overflow / payload DoS protection)
  if (err.type === 'entity.too.large' || err.status === 413) {
    statusCode = 413;
    message = 'Payload size exceeded: Request body exceeds maximum permitted threshold (100kb).';
  }

  // Zod Validation Error handling
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Input validation failed';
    errors = (err.errors || []).map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for resource ID: ${err.value}`;
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Record'} already exists.`;
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error occurred';
    errors = Object.values(err.errors).map(el => ({
      field: el.path,
      message: el.message
    }));
  }

  if (process.env.NODE_ENV !== 'test' && statusCode === 500) {
    console.error('[UNHANDLED SERVER ERROR]:', err);
  }

  return sendError(res, statusCode, message, errors);
};
