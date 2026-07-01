import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { verifyPassword } from '../utils/verifyPassword.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../utils/cloudinary.js';
import { deleteImage } from '../utils/cloudinary.js';
import {uploadImage} from '../utils/cloudinary.js';
export const getUserProfile = async (req, res, next) => {
  const { username, userName } = req.params;
  const resolvedUsername = username || userName;

  const user = await User.findOne({ userName: resolvedUsername }).select('-password');
  if (!user) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  }
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, 'User found successfully'));
};

export const followUnfollowUser = async (req, res, next) => {
  const { id } = req.params;

  // User to follow/unfollow
  const userToModify = await User.findById(id);

  // Logged-in user
  const currentUser = await User.findById(req.user._id);

  // Cannot follow yourself
  if (id === req.user._id.toString()) {
    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        'You cannot follow/unfollow yourself',
      ),
    );
  }

  if (!userToModify || !currentUser) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  }

  const isFollowing = currentUser.following.some(
    (userId) => userId.toString() === id,
  );

  if (isFollowing) {
    // Remove from current user's following
    currentUser.following.pull(id);

    // Remove from target user's followers
    userToModify.followers.pull(currentUser._id);

    await currentUser.save();
    await userToModify.save();
    const notification = new Notification({
      from: currentUser._id,
      to: userToModify._id,
      type: 'unfollow',
      read: false,
    });
    await notification.save();
    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          currentUser,
          'User unfollowed successfully',
        ),
      );
  }

  // Follow
  currentUser.following.push(id);
  userToModify.followers.push(currentUser._id);

  await currentUser.save();
  await userToModify.save();
  const notification = new Notification({
    type: 'follow',
    from: currentUser._id,
    to: userToModify._id,
    read: false,
  });
  await notification.save();
  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        currentUser,
        'User followed successfully',
      ),
    );
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      userName,
      username,
      bio,
      link,
      currentPassword,
      newPassword,
      email,
    } = req.body || {};

    const profileImgFile = req.files?.profileImg || req.files?.['profileImg'];
    const coverImgFile = req.files?.coverImg || req.files?.['coverImg'];
    const resolvedUserName = username || userName;

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
    }

    // =====================
    // PASSWORD UPDATE
    // =====================

    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'Please provide both current password and new password',
        ),
      );
    }

    if (currentPassword && newPassword) {
      const isMatch = await verifyPassword(currentPassword, user.password);

      if (!isMatch) {
        return next(
          new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Current password is incorrect',
          ),
        );
      }

      if (newPassword.length < 6) {
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            'Password must be at least 6 characters',
          ),
        );
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // =====================
    // PROFILE IMAGE
    // =====================

    if (profileImgFile) {
      await deleteImage(user.profileImgId);

      const image = await uploadImage(
        profileImgFile,
        'twitter-clone/profile',
      );

      user.profileImg = image.secure_url;
      user.profileImgId = image.public_id;
    }

    // =====================
    // COVER IMAGE
    // =====================

    if (coverImgFile) {
      await deleteImage(user.coverImgId);

      const image = await uploadImage(
        coverImgFile,
        'twitter-clone/cover',
      );

      user.coverImg = image.secure_url;
      user.coverImgId = image.public_id;
    }

    // =====================
    // UPDATE USER DETAILS
    // =====================

    user.fullName = fullName ?? user.fullName;
    user.email = email ?? user.email;
    user.userName = resolvedUserName ?? user.userName;
    user.bio = bio ?? user.bio;
    user.link = link ?? user.link;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          updatedUser,
          'Profile updated successfully',
        ),
      );
  } catch (error) {
    next(error);
  }
};
export const getSuggestedUsers = async (req, res, next) => {
  const currentUser = await User.findById(req.user._id);

  if (!currentUser) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  }

  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $nin: [currentUser._id, ...currentUser.following],
        },
      },
    },
    {
      $sample: { size: 10 },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        users,
        'Suggested users fetched successfully',
      ),
    );
};
