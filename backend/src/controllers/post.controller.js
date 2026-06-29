import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { deleteImage, uploadImage } from '../utils/cloudinary.js';
import cloudinary from '../utils/cloudinary.js';

export const createPost = async (req, res, next) => {
  const { text } = req.body || {};
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  }

  if (!text && !req.files?.Img) {
    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        'Post must contain text or an image',
      ),
    );
  }

  let Img = '';
  let ImgId = '';

  if (req.files?.Img) {
    const image = await uploadImage(req.files.Img, 'twitter-clone/posts');

    Img = image.secure_url;
    ImgId = image.public_id;
  }

  const newPost = await Post.create({
    text,
    Img,
    ImgId,
    user: userId,
  });

  return res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        newPost,
        'Post created successfully',
      ),
    );
};

export const deletePost = async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'Post not found'));
  }

  if (id !== req.user._id.toString()) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'));
  }

  if (post.ImgId) {
    await cloudinary.uploader.destroy(post.ImgId);
  }

  await Post.findByIdAndDelete(id);

  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, 'Post deleted successfully'));
};
