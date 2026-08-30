import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/apiError.js';

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'roomnest_super_secret_jwt_key_prod_2026_india';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id: userId, role }, secret, { expiresIn });
};

export const registerUser = async (userData) => {
  const { name, email, phone, password, role } = userData;

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedPhone = phone.trim();

  // Check unique constraints
  const existingEmail = await User.findOne({ email: normalizedEmail });
  if (existingEmail) {
    throw new ApiError(400, 'Email address is already registered');
  }

  const existingPhone = await User.findOne({ phone: normalizedPhone });
  if (existingPhone) {
    throw new ApiError(400, 'Phone number is already registered');
  }

  // Hash password with salt rounds = 12
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
    role: role || 'tenant'
  });

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verificationStatus: user.verificationStatus
    }
  };
};

export const loginUser = async (identifier, password) => {
  const cleanIdentifier = identifier.trim();

  // Determine if identifier is email or phone
  const isEmail = cleanIdentifier.includes('@');
  const query = isEmail
    ? { email: cleanIdentifier.toLowerCase() }
    : { phone: cleanIdentifier };

  const user = await User.findOne(query).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid email/phone or password');
  }

  if (user.isBlocked || !user.isActive) {
    throw new ApiError(403, 'Account is deactivated or blocked');
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new ApiError(401, 'Invalid email/phone or password');
  }

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verificationStatus: user.verificationStatus
    }
  };
};
