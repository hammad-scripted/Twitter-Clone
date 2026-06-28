import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';
import ApiResponse from '../utils/apiResponse.js';
import { generateTokenAndSetCookie } from '../utils/token.js';
import { verifyPassword } from '../utils/verifyPassword.js';
export const login = async (req, res, next) => {
  const { userName, password } = req.body;

  const user = await User.findOne({ userName });

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
    .json(new ApiResponse(StatusCodes.OK, 'login successfully', user));
};

export const logout = async (req, res, next) => {
  res.json({
    message: 'signup',
  });
};

export const signup = async (req, res, next) => {
  const { fullName, userName, email, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userName: userName }, { email: email }],
  });

  if (existingUser) {
    return next(new ApiError(StatusCodes.CONFLICT, 'User already exists'));
  }

  const newUser = new User({
    fullName,
    userName,
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
        'User created successfully',
        newUser,
      ),
    );
};
