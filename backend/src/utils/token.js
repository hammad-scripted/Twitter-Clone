import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '2d',
  });

  res.cookie('jwt', token, {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return token;
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Please login first'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'));
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    // JWT verification failures (expired / malformed) are auth errors, not 500s.
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return next(
        new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token'),
      );
    }

    return next(error);
  }
};
