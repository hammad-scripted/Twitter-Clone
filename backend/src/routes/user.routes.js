import express from 'express';
import { Router } from 'express';
import { protect } from '../middlewares/protect.js';

import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUserProfile
} from '../controllers/user.controller.js';

const router = Router();

router.get('/profile/:userName', getUserProfile);
router.get('/suggested', protect, getSuggestedUsers);
router.post('/follow/:id', protect, followUnfollowUser);
router.post("/update",protect,updateUserProfile)

export default router;
