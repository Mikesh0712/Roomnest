export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, extraProps = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extraProps
  });
};

export const sendError = (res, statusCode = 400, message = 'Error', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
