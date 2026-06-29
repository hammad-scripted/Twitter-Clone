import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';




const postPopulateOptions = [
  {
    path: 'user',
    select: '-password',
  },
  {
    path: 'comments.user',
    select: '-password',
  },
];
export const createPost = async (req, res, next) => {
  const { text } = req.body || {};
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'User not found'));
  }

  if (!text?.trim() && !req.files?.Img) {
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
    user: userId,
    text: text?.trim() || '',
    Img,
    ImgId,
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
  const { id: postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(new ApiError(StatusCodes.NOT_FOUND, 'Post not found'));
  }

  if (post.user.toString() !== req.user._id.toString()) {
    return next(
      new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'),
    );
  }

  if (post.ImgId) {
    await deleteImage(post.ImgId);
  }

  await Notification.deleteMany({
    post: postId,
  });

  await Post.findByIdAndDelete(postId);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        null,
        'Post deleted successfully',
      ),
    );
};

export const commentOnPost = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { text } = req.body || {};

  if (!text?.trim()) {
    return next(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        'Comment cannot be empty',
      ),
    );
  }

  const post = await Post.findById(postId);

  if (!post) {
    return next(
      new ApiError(StatusCodes.NOT_FOUND, 'Post not found'),
    );
  }

  post.comments.push({
    user: userId,
    text: text.trim(),
  });

  await post.save();

  await post.populate({
    path: 'comments.user',
    select: '-password',
  });

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        post,
        'Comment added successfully',
      ),
    );
};

export const likeUnlikePost = async (req, res, next) => {
  const { id: postId } = req.params;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    return next(
      new ApiError(StatusCodes.NOT_FOUND, 'Post not found'),
    );
  }

  const isLiked = post.likes.some(
    (id) => id.toString() === userId.toString(),
  );

  if (isLiked) {
    post.likes.pull(userId);

    await post.save();

    return res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          post,
          'Post unliked successfully',
        ),
      );
  }

  post.likes.addToSet(userId);

  await post.save();

  if (post.user.toString() !== userId.toString()) {
    await Notification.create({
      from: userId,
      to: post.user,
      post: post._id,
      type: 'like',
    });
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        post,
        'Post liked successfully',
      ),
    );
};


export const getAllPosts = async (req, res, next) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate(postPopulateOptions);

  if (posts.length === 0) {
    return next(
      new ApiError(StatusCodes.NOT_FOUND, 'No posts found'),
    );
  }

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        posts,
        'Posts fetched successfully',
      ),
    );
};

export const getLikedPosts = async (req, res, next) => {
  const { id: userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new ApiError(StatusCodes.NOT_FOUND, 'User not found'),
    );
  }

  const posts = await Post.find({
    likes: userId,
  })
    .sort({ createdAt: -1 })
    .populate(postPopulateOptions);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        posts,
        'Liked posts fetched successfully',
      ),
    );
};
export const getFollowingPosts = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new ApiError(StatusCodes.NOT_FOUND, 'User not found'),
    );
  }

  const posts = await Post.find({
    user: {
      $in: user.following,
    },
  })
    .sort({ createdAt: -1 })
    .populate(postPopulateOptions);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        posts,
        'Following posts fetched successfully',
      ),
    );
};export const getUserPosts = async (req, res, next) => {
  const { userName } = req.params;

  const user = await User.findOne({
    userName,
  });

  if (!user) {
    return next(
      new ApiError(StatusCodes.NOT_FOUND, 'User not found'),
    );
  }

  const posts = await Post.find({
    user: user._id,
  })
    .sort({ createdAt: -1 })
    .populate(postPopulateOptions);

  return res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        posts,
        'User posts fetched successfully',
      ),
    );
};