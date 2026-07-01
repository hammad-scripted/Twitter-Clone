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

router.get('/profile/:username', getUserProfile);
router.get('/suggested', protect, getSuggestedUsers);
router.post('/follow/:id', protect, followUnfollowUser);
router.put("/update",protect,updateUserProfile)

export default router;
