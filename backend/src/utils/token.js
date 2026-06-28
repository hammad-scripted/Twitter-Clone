import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
export const generateTokenAndSetCookie = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    });

    res.cookie('jwt', token, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  } catch (error) {
    console.log(error);
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Please login first'));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (!decoded) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'));
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
