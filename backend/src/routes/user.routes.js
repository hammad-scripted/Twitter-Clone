import express from 'express';
import { Router } from 'express';
import { protect } from '../middlewares/protect.js';

import {
  getUserProfile,
  followUnfollowUser,
} from '../controllers/user.controller.js';

const router = Router();

router.get('/profile/:userName', getUserProfile);
router.get('/suggested', protect, getUserProfile);
router.post('/follow/:id', protect, followUnfollowUser);
// router.post("/update",protect,updateUserProfile)

export default router;
