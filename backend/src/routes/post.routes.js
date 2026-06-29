import express from 'express';
import { Router } from 'express';
import { protect } from '../middlewares/protect.js';

import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts
} from '../controllers/post.controller.js';
const router = Router();

router.get('/all', protect,getAllPosts)
router.get("/following",protect,getFollowingPosts)
router.get("/liked/:id",protect,getLikedPosts)
router.post('/create', protect, createPost);
router.delete('/delete/:id', protect, deletePost);
router.post('/like/:id', protect, likeUnlikePost);
router.post('/comment/:postId', protect, commentOnPost);

export default router;
