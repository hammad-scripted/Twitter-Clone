import express from 'express';
import { Router } from 'express';
import { protect } from '../middlewares/protect.js';

import {
    createPost,
    deletePost
    
} from '../controllers/post.controller.js'
const router = Router();

router.post('/create', protect, createPost);
router.delete('/delete/:id', protect, deletePost);
// router.post('/like/:id', protect, likeUnlikePost);
// router.post('/comment/:id', protect, commentPost);

export default router;
