import fs from 'node:fs/promises';

import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';

import { env } from '../config/env.js';
import ApiError from './apiError.js';

cloudinary.config({
  cloud_name: env.cloudinaryName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true,
});

export const uploadImage = async (file, folder = 'twitter-clone') => {
  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No file uploaded');
  }

  if (!file.mimetype?.startsWith('image/')) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Only image files are allowed');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Image size must be less than 5 MB');
  }

  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: 'image',
    });

    return { secure_url, public_id };
  } finally {
    if (file.tempFilePath) {
      await fs.unlink(file.tempFilePath).catch(() => undefined);
    }
  }
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
