import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export const authMiddleware = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 401, 'Authentication token missing. Please log in.');
    }

    const secret = process.env.JWT_SECRET || 'roomnest_super_secret_jwt_key_prod_2026_india';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 401, 'The user belonging to this token no longer exists.');
    }

    if (user.isBlocked || !user.isActive) {
      return sendError(res, 403, 'Your account has been deactivated or blocked by admin.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Invalid or expired token. Please log in again.');
    }
    return sendError(res, 500, error.message);
  }
};
