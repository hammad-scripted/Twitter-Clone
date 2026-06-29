import express from 'express';
import { Router } from 'express';
import { login, signup, logout ,getMe} from '../controllers/auth.controller.js';
import {
  userValidationRules,
  validate,
} from '../middlewares/validator.js';
import { protect } from '../middlewares/protect.js';
const router = Router();

router.get('/me', protect, getMe);
router.post('/login', login);
router.post('/logout', logout);
router.post('/signup', userValidationRules(), validate, signup);

export default router;
