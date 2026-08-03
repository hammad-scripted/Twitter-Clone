import ApiResponse from '../utils/apiResponse.js';
import { StatusCodes } from 'http-status-codes';
import Notification from '../models/notification.model.js';

export const getNotifications = async (req, res, next) => {
  const userId = req.user._id;

  const notifications = await Notification.find({ to: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'from',
      select: 'userName profileImg',
    });

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

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        null,
        'Notifications deleted successfully',
      ),
    );
};
