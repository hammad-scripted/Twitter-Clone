import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import { StatusCodes } from 'http-status-codes';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
export const getUserProfile = async (req, res, next) => {
  const { userName } = req.params;

  const user = await User.findOne({ userName }).select('-password');
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
  const userId = req.user._id;
  if (!userId) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  }
  const user = await User.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, 'User updated successfully'));
};

export const getSuggestedUsers = async (req, res, next) => {
  const userId = req.user._id;

  const users = await User.find({ _id: { $ne: userId } }).limit(10);
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, users, 'Users found successfully'));
};
