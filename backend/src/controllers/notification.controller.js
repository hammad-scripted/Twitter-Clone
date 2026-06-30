import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';
import Notification from '../models/notification.model.js';
export const getNotifications = async (req, res, next) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ to: userId }).populate({
    path: 'from',
    select: 'userName profileImg',
  });

  if (!notifications) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'Notifications not found'));
  }
  if (notifications.length === 0) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'Notifications not found'));
  }

  await Notification.updateMany({ to: userId }, { read: true });

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        notifications,
        'Notifications fetched successfully',
      ),
    );
};

export const deleteNotifications = async (req, res, next) => {
  const userId = req.user._id;

  await Notification.deleteMany({ to: userId });

  return res.json(
    new ApiResponse(
      StatusCodes.DELETED,
      null,
      'Notifications deleted successfully',
    ),
  );
};
