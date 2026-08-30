import { sendError } from '../utils/apiResponse.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorFormatted = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return sendError(res, 400, 'Validation failed', errorFormatted);
    }
    req.body = result.data;
    next();
  };
};
