import { v2 as cloudinary } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import ApiError from './apiError.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  file,
  folder = 'twitter-clone'
) => {
  if (!file) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'No file uploaded'
    );
  }

  if (!file.mimetype.startsWith('image/')) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Only image files are allowed'
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Image size must be less than 5 MB'
    );
  }

  const { secure_url, public_id } =
    await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: 'image',
    });

  await fs.unlink(file.tempFilePath);

  return { secure_url, public_id };
};

export const deleteImage = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;