import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { generateTokenAndSetCookie } from '../utils/token.js';
import { verifyPassword } from '../utils/verifyPassword.js';
export const login = async (req, res, next) => {
  const { username, userName, password } = req.body;
  const resolvedUsername = username || userName;

  const user = await User.findOne({ userName: resolvedUsername });

  if (!user) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  }

  // ? passwordChecking

  const isPasswordCorrect = await verifyPassword(password, user.password);

  if (!isPasswordCorrect) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'password incorrect'));
  }
  generateTokenAndSetCookie(user._id, res);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, 'Logged in successfully'));
};

export const logout = async (req, res, next) => {
  res.clearCookie('jwt');
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Logged out successfully'));
};

export const signup = async (req, res, next) => {
  const { fullName, username, userName, email, password } = req.body;
  const resolvedUsername = username || userName;

  const existingUser = await User.findOne({
    $or: [{ userName: resolvedUsername }, { email: email }],
  });

  if (existingUser) {
    return next(new ApiError(StatusCodes.CONFLICT, 'User already exists'));
  }

  const newUser = new User({
    fullName,
    userName: resolvedUsername,
    email,
    password,
  });

  if (newUser) {
    generateTokenAndSetCookie(newUser._id, res);
  }
  await newUser.save();

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        newUser,
        'User created successfully',
      ),
    );
};

export const getMe = async (req, res, next) => {
  const userId = req.user._id;
  const currentUser = await User.findById(userId).select('-password');
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(StatusCodes.OK, currentUser, 'User found successfully'),
    );
};
